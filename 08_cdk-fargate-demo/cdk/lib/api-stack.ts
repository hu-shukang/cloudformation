import * as cdk from 'aws-cdk-lib';
import { Context } from '../context';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Role } from 'aws-cdk-lib/aws-iam';
import { ApplicationLoadBalancer, ApplicationProtocol } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Cluster, ContainerImage, LogDriver } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';

export class APIStack extends cdk.Stack {
  constructor(scope: Construct, id: string, context: Context, props?: cdk.StackProps) {
    super(scope, id, props);

    const suffix = context.suffix;
    const vpc = new ec2.Vpc(this, `${context.apiName}-VPC${suffix}`, {
      cidr: context.vpcCIDR,
      createInternetGateway: true,
      maxAzs: 2,
      vpcName: `${context.apiName}-VPC`,
      enableDnsSupport: true,
      enableDnsHostnames: true,
      restrictDefaultSecurityGroup: false,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 26,
          name: `${context.apiName}-Public-Subnet`,
        },
        {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 26,
          name: `${context.apiName}-Protected-Subnet`,
        },
      ],
    });

    // Create a Security Group for Public Subnet
    const publicSg = new ec2.SecurityGroup(this, `PublicSecurityGroup${suffix}`, {
      vpc: vpc,
      securityGroupName: `PublicSecurityGroup${suffix}`,
      description: 'Allow ssh access to ec2 instances',
      allowAllOutbound: true,
    });
    publicSg.addIngressRule(
      ec2.Peer.anyIpv4(), // Allow traffic from all IP addresses
      ec2.Port.tcp(80),
      'Allow 80 inbound traffic',
    );

    // Create a Security Group for Protected Subnet
    const protectedSg = new ec2.SecurityGroup(this, `ProtectedSecurityGroup${suffix}`, {
      vpc: vpc,
      securityGroupName: `ProtectedSecurityGroup${suffix}`,
      description: 'Allow all traffic from public security group',
    });

    protectedSg.addIngressRule(publicSg, ec2.Port.tcp(3000), 'Allow 3000 inbound traffic');

    // Create ECR DKR Interface Endpoint
    new ec2.InterfaceVpcEndpoint(this, `EcrDkrEndpoint${suffix}`, {
      vpc: vpc,
      service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
      subnets: { subnets: vpc.isolatedSubnets },
      securityGroups: [protectedSg],
    });

    // Create ECR API Interface Endpoint
    new ec2.InterfaceVpcEndpoint(this, `EcrApiEndpoint${suffix}`, {
      vpc: vpc,
      service: ec2.InterfaceVpcEndpointAwsService.ECR,
      subnets: { subnets: vpc.isolatedSubnets },
      securityGroups: [protectedSg],
    });

    // Create S3 Gateway Endpoint
    new ec2.GatewayVpcEndpoint(this, `S3Endpoint${suffix}`, {
      vpc: vpc,
      service: ec2.GatewayVpcEndpointAwsService.S3,
      subnets: [
        {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // Create ECR API Interface Endpoint
    new ec2.InterfaceVpcEndpoint(this, `EcrLog${suffix}`, {
      vpc: vpc,
      service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
      subnets: { subnets: vpc.isolatedSubnets },
      securityGroups: [protectedSg],
    });

    const ecsTaskExecutionRole = Role.fromRoleArn(
      this,
      `EcsTaskExecutionRole${suffix}`,
      context.ecsTaskExecutionRoleArn,
      {
        mutable: false,
      },
    );

    const ecsTaskRole = Role.fromRoleArn(this, `EcsTaskRole${suffix}`, context.ecsTaskRoleArn, {
      mutable: false,
    });

    const alb = new ApplicationLoadBalancer(this, `ALB${suffix}`, {
      vpc: vpc,
      vpcSubnets: { subnets: vpc.publicSubnets },
      internetFacing: true,
      loadBalancerName: `${context.apiName}-alb${suffix}`,
      securityGroup: publicSg,
      idleTimeout: cdk.Duration.seconds(60),
    });

    // Fargate
    const ecrImageTag = context.ecrImageTag;
    const ecsLogGroup = new LogGroup(this, `LogGroup${suffix}`, {
      logGroupName: `${context.apiName}-log${suffix}`,
      retention: RetentionDays.ONE_DAY,
    });
    const cluster = new Cluster(this, `ECSCluster${suffix}`, {
      vpc: vpc,
      clusterName: `${context.apiName}${suffix}`,
    });
    const service = new ApplicationLoadBalancedFargateService(this, `ECSService${suffix}`, {
      cluster: cluster,
      protocol: ApplicationProtocol.HTTP,
      targetProtocol: ApplicationProtocol.HTTP,
      securityGroups: [protectedSg],
      listenerPort: 80,
      loadBalancer: alb,
      openListener: false,
      publicLoadBalancer: false,
      taskSubnets: { subnets: vpc.isolatedSubnets },
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
        },
      },
      serviceName: `${context.apiName}${suffix}`,
    });

    service.targetGroup.configureHealthCheck({
      path: '/api/healthcheck',
    });

    // // AutoScaling設定
    // const autoScaling = service.service.autoScaleTaskCount({
    //   maxCapacity: 50,
    //   minCapacity: 1,
    // });
    // autoScaling.scaleOnCpuUtilization(`ScalingOnCPU${suffix}`, {
    //   targetUtilizationPercent: 60,
    //   scaleInCooldown: cdk.Duration.seconds(60),
    //   scaleOutCooldown: cdk.Duration.seconds(60),
    // });
    // autoScaling.scaleOnMemoryUtilization(`ScalingOnMemory${suffix}`, {
    //   targetUtilizationPercent: 60,
    //   scaleInCooldown: cdk.Duration.seconds(60),
    //   scaleOutCooldown: cdk.Duration.seconds(60),
    // });
  }
}
