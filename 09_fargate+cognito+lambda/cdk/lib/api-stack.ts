import * as cdk from 'aws-cdk-lib';
import { Context } from '../context';
import { Construct } from 'constructs';
import { Role } from 'aws-cdk-lib/aws-iam';
import { ApplicationLoadBalancer, ApplicationProtocol } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Cluster, ContainerImage, LogDriver } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { SecurityGroup, Subnet, Vpc } from 'aws-cdk-lib/aws-ec2';
import * as s3Assets from 'aws-cdk-lib/aws-s3-assets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import {
  AuroraPostgresEngineVersion,
  CaCertificate,
  ClusterInstance,
  Credentials,
  DatabaseCluster,
  DatabaseClusterEngine,
  SubnetGroup,
} from 'aws-cdk-lib/aws-rds';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import * as dotenv from 'dotenv';
import path from 'path';

export class APIStack extends cdk.Stack {
  constructor(scope: Construct, id: string, context: Context, props?: cdk.StackProps) {
    super(scope, id, props);

    const suffix = context.suffix;

    // vpc resource
    const vpc = Vpc.fromLookup(this, `VPC${suffix}`, { vpcId: context.vpcId });
    const publicSubnetA = Subnet.fromSubnetId(this, `public-subnetA${suffix}`, context.publicSubnetIdA);
    const publicSubnetC = Subnet.fromSubnetId(this, `public-subnetC${suffix}`, context.publicSubnetIdC);
    const protectedSubnetA = Subnet.fromSubnetId(this, `protected-subnetA${suffix}`, context.protectedSubnetIdA);
    const protectedSubnetC = Subnet.fromSubnetId(this, `protected-subnetC${suffix}`, context.protectedSubnetIdC);
    const privateSubnetA = Subnet.fromSubnetId(this, `private-subnetA${context.suffix}`, context.privateSubnetIdA);
    const privateSubnetC = Subnet.fromSubnetId(this, `private-subnetC${context.suffix}`, context.privateSubnetIdC);

    // subnet groups
    const publicSubnets = { subnets: [publicSubnetA, publicSubnetC] };
    const protectedSubnets = { subnets: [protectedSubnetA, protectedSubnetC] };
    const privateSubnets = { subnets: [privateSubnetA, privateSubnetC] };

    const albSecurityGroup = SecurityGroup.fromLookupById(this, `alb-sg${suffix}`, context.albSecurityGroup);
    const ecsSecurityGroup = SecurityGroup.fromLookupById(this, `ecs-sg${suffix}`, context.ecsSecurityGroup);

    // SecretsManagerを作成する
    const { dbSecret, cryptoKey } = this.createSecretsManager(context);

    // Lambdaを作成する
    const { cognitoTriggerFunc } = this.createLambda(context, vpc, protectedSubnets, ecsSecurityGroup, cryptoKey);

    // RDSを作成する
    const cluster = this.createRDS(context, vpc, dbSecret, privateSubnets);

    // Cognito UserPoolを作成する
    const { userPoolClientId } = this.createCognito(context, cognitoTriggerFunc);

    // Fargateを作成する
    this.createFargate(
      context,
      vpc,
      dbSecret,
      cluster,
      userPoolClientId,
      publicSubnets,
      protectedSubnets,
      albSecurityGroup,
      ecsSecurityGroup,
      cryptoKey,
    );
  }

  /**
   * RDSを作成する
   *
   * @param context Context
   * @param vpc VPC
   * @param secret DB用のSecretManager
   * @param privateSubnets PrivateSubnets
   * @returns RDS Cluster
   */
  private createRDS(
    context: Context,
    vpc: cdk.aws_ec2.IVpc,
    secret: Secret,
    privateSubnets: cdk.aws_ec2.SubnetSelection,
  ) {
    const rdsSubnetGroup = SubnetGroup.fromSubnetGroupName(
      this,
      `subnet-group${context.suffix}`,
      context.rdsSubnetGroupName,
    );

    const rdsSecurityGroup = SecurityGroup.fromLookupById(this, `rds-sg${context.suffix}`, context.rdsSecurityGroup);

    const cluster = new DatabaseCluster(this, `db-cluster${context.suffix}`, {
      engine: DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.VER_16_1 }),
      clusterIdentifier: `${context.apiName}-db-cluster${context.suffix}`,
      defaultDatabaseName: context.apiName.replace(/[^a-zA-Z]/g, ''), //アルファベット以外の文字を削除する
      vpc: vpc,
      vpcSubnets: privateSubnets,
      serverlessV2MinCapacity: 0.5,
      serverlessV2MaxCapacity: 64,
      backup: { retention: cdk.Duration.days(7) },
      credentials: Credentials.fromSecret(secret),
      subnetGroup: rdsSubnetGroup,
      securityGroups: [rdsSecurityGroup],
      storageEncrypted: true,
      writer: ClusterInstance.serverlessV2(`${context.apiName}-db${context.suffix}-instance-1`, {
        autoMinorVersionUpgrade: false,
        instanceIdentifier: `${context.apiName}-db${context.suffix}-instance-1`,
        enablePerformanceInsights: false,
        publiclyAccessible: false,
        caCertificate: CaCertificate.RDS_CA_ECC384_G1,
      }),
      readers: [
        ClusterInstance.serverlessV2(`${context.apiName}-db${context.suffix}-instance-2`, {
          autoMinorVersionUpgrade: false,
          instanceIdentifier: `${context.apiName}-db${context.suffix}-instance-2`,
          enablePerformanceInsights: false,
          publiclyAccessible: false,
          caCertificate: CaCertificate.RDS_CA_ECC384_G1,
        }),
      ],
    });
    return cluster;
  }

  /**
   * Fargateを作成する
   *
   * @param context Context
   * @param vpc VPC
   * @param secret DB用のSecret
   * @param dbCluster DBクラスター
   * @param userPoolClientId UserPool Client ID
   * @param publicSubnets PublicSubnets
   * @param protectedSubnets ProtectedSubnets
   * @param albSecurityGroup ALB SecurityGroup
   * @param ecsSecurityGroup ECS SecurityGroup
   * @param cryptoKey 暗号化用のSecret
   * @returns ALB
   */
  private createFargate(
    context: Context,
    vpc: cdk.aws_ec2.IVpc,
    secret: Secret,
    dbCluster: DatabaseCluster,
    userPoolClientId: string,
    publicSubnets: cdk.aws_ec2.SubnetSelection,
    protectedSubnets: cdk.aws_ec2.SubnetSelection,
    albSecurityGroup: cdk.aws_ec2.ISecurityGroup,
    ecsSecurityGroup: cdk.aws_ec2.ISecurityGroup,
    cryptoKey: Secret,
  ) {
    const suffix = context.suffix;
    const fastifyEnv = dotenv.config({ path: path.join(__dirname, `../../env/.env.${context.env}`) });

    const ecsTaskExecutionRole = Role.fromRoleArn(
      this,
      `ECSTaskExecutionRole${suffix}`,
      context.ecsTaskExecutionRoleArn,
      {
        mutable: false,
      },
    );

    const ecsTaskRole = Role.fromRoleArn(this, `ECSTaskRole${suffix}`, context.ecsTaskRoleArn, {
      mutable: false,
    });

    const alb = new ApplicationLoadBalancer(this, `ALB${suffix}`, {
      vpc: vpc,
      vpcSubnets: publicSubnets,
      internetFacing: true,
      loadBalancerName: `${context.apiName}-alb${suffix}`,
      securityGroup: albSecurityGroup,
      idleTimeout: cdk.Duration.seconds(60),
    });

    // Fargate
    const ecrImageTag = context.ecrImageTag;
    const ecsLogGroup = new LogGroup(this, `LogGroup${suffix}`, {
      logGroupName: `${context.apiName}-log${suffix}`,
      retention: RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const cluster = new Cluster(this, `ECSCluster${suffix}`, {
      vpc: vpc,
      clusterName: `${context.apiName}${suffix}`,
    });
    const service = new ApplicationLoadBalancedFargateService(this, `ECSService${suffix}`, {
      cluster: cluster,
      protocol: ApplicationProtocol.HTTP,
      targetProtocol: ApplicationProtocol.HTTP,
      securityGroups: [ecsSecurityGroup],
      listenerPort: 80,
      loadBalancer: alb,
      openListener: false,
      publicLoadBalancer: false,
      taskSubnets: protectedSubnets,
      memoryLimitMiB: 1024,
      cpu: 512,
      desiredCount: 1,
      maxHealthyPercent: 200,
      minHealthyPercent: 100,
      healthCheckGracePeriod: cdk.Duration.seconds(500),
      taskImageOptions: {
        image: ContainerImage.fromRegistry(`${context.ecrRepositoryURI}:${ecrImageTag}`),
        logDriver: LogDriver.awsLogs({
          logGroup: ecsLogGroup,
          streamPrefix: 'api',
        }),
        executionRole: ecsTaskExecutionRole,
        taskRole: ecsTaskRole,
        containerPort: 3000,
        environment: {
          TZ: 'Asia/Tokyo',
          NODE_ENV: context.env,
          DB_HOST: secret.secretValueFromJson('host').unsafeUnwrap(),
          DB_USERNAME: secret.secretValueFromJson('username').unsafeUnwrap(),
          DB_PASSWORD: secret.secretValueFromJson('password').unsafeUnwrap(),
          DB_NAME: secret.secretValueFromJson('dbname').unsafeUnwrap(),
          USER_POOL_CLIENT_ID: userPoolClientId,
          CRYPTO_KEY: cryptoKey.secretArn,
          ...fastifyEnv.parsed,
        },
      },
      serviceName: `${context.apiName}${suffix}`,
    });

    service.node.addDependency(dbCluster);

    service.targetGroup.configureHealthCheck({
      path: '/api/healthcheck',
    });

    // AutoScaling設定
    const autoScaling = service.service.autoScaleTaskCount({
      maxCapacity: 50,
      minCapacity: 1,
    });
    autoScaling.scaleOnCpuUtilization(`ScalingOnCPU${suffix}`, {
      targetUtilizationPercent: 60,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });
    autoScaling.scaleOnMemoryUtilization(`ScalingOnMemory${suffix}`, {
      targetUtilizationPercent: 60,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });

    return { alb, cluster, service };
  }

  /**
   * Cognito UserPoolを作成する
   *
   * @param context Context
   * @param customMessageLambda メッセージをカスタマイズ用のLambda
   * @returns UserPool ID
   */
  private createCognito(context: Context, customMessageLambda?: lambda.Function) {
    const userPool = new cognito.UserPool(this, `${context.apiName}-user-pool${context.suffix}`, {
      userPoolName: `${context.apiName}-user-pool${context.suffix}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      lambdaTriggers: { customMessage: customMessageLambda },
      email: cognito.UserPoolEmail.withSES({
        fromEmail: 'no-reply@hushukang.com',
        sesRegion: 'ap-northeast-1',
      }),
    });

    const userPoolClient = new cognito.UserPoolClient(this, `${context.apiName}-user-pool-client${context.suffix}`, {
      userPoolClientName: `${context.apiName}-user-pool-client${context.suffix}`,
      userPool: userPool,
      generateSecret: false,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
    });

    return {
      userPoolId: userPool.userPoolId,
      userPoolClientId: userPoolClient.userPoolClientId,
    };
  }

  /**
   * Lambdaを作成する
   *
   * @param context Context
   * @param vpc VPC
   * @param protectedSubnets ProtectedSubnet
   * @param ecsSecurityGroup ECSSecurityGroup
   * @param cryptoKey 暗号化用のSecretManager
   * @returns Lambda
   */
  private createLambda(
    context: Context,
    vpc: cdk.aws_ec2.IVpc,
    protectedSubnets: cdk.aws_ec2.SubnetSelection,
    ecsSecurityGroup: cdk.aws_ec2.ISecurityGroup,
    cryptoKey: Secret,
  ) {
    const lambdaAccessRole = Role.fromRoleArn(
      this,
      'lambdaAccessRole',
      `arn:aws:iam::${context.account}:role/LambdaAccessRole`,
      { mutable: false },
    );

    const bucket = s3.Bucket.fromBucketName(this, `AssetBucket`, context.fileAssetsBucketName);

    const layerAsset = new s3Assets.Asset(this, `common-layer-${context.env}-Asset`, {
      path: path.join(__dirname, '../../lambda/layers/common-layer'),
    });
    const commonLayer = new lambda.LayerVersion(this, `common-layer-${context.env}`, {
      layerVersionName: `common-layer-${context.env}`,
      compatibleRuntimes: [lambda.Runtime.NODEJS_LATEST],
      code: lambda.Code.fromBucket(bucket, layerAsset.assetPath + '.zip'),
    });

    const lambdaConfig = {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      role: lambdaAccessRole,
      timeout: cdk.Duration.minutes(15),
      memorySize: 128,
      layers: [commonLayer],
      vpc: vpc,
      vpcSubnets: protectedSubnets,
      allowPublicSubnet: false,
    };

    const cognitoTriggerFuncAsset = new s3Assets.Asset(this, `cognito-trigger-func-${context.env}-Asset`, {
      path: path.join(__dirname, '../../lambda/functions/cognito_trigger'),
    });
    const cognitoTriggerFunc = new lambda.Function(this, `cognito-trigger-func-${context.env}`, {
      ...lambdaConfig,
      description: 'cognito trigger',
      code: lambda.Code.fromBucket(bucket, cognitoTriggerFuncAsset.assetPath + '.zip'),
      functionName: `cognito-trigger-func-${context.env}`,
      securityGroups: [ecsSecurityGroup],
      environment: {
        CRYPTO_KEY: cryptoKey.secretArn,
      },
    });

    new cdk.CfnOutput(this, 'assetPath', { value: cognitoTriggerFuncAsset.assetPath });
    new cdk.CfnOutput(this, 'assetHash', { value: cognitoTriggerFuncAsset.assetHash });
    new cdk.CfnOutput(this, 's3ObjectKey', { value: cognitoTriggerFuncAsset.s3ObjectKey });
    new cdk.CfnOutput(this, 's3ObjectUrl', { value: cognitoTriggerFuncAsset.s3ObjectUrl });

    return { cognitoTriggerFunc };
  }

  /**
   * SecretsManagerを作成する
   * @param context Context
   * @returns SecretsManager
   */
  private createSecretsManager(context: Context) {
    /** DB用のSecret */
    const dbSecret = new Secret(this, `rds-secret${context.suffix}`, {
      secretName: `${context.apiName}-rds-secret${context.suffix}`,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'postgres' }),
        generateStringKey: 'password',
        passwordLength: 10,
        excludeCharacters: '"@/$&:{}()[]+*=^-|',
      },
    });

    /** 暗号化用のSecret */
    const cryptoKey = new Secret(this, `crypto-key-${context.env}`, {
      secretName: `crypto-key-${context.env}`,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ key: 'value' }),
        generateStringKey: 'password',
      },
    });
    return { dbSecret, cryptoKey };
  }
}
