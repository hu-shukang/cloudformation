import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class CodePipelineRoleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const account = props?.env?.account as string;
    const region = props?.env?.region as string;

    const codePipelinePolicy = new iam.ManagedPolicy(this, 'CodePipelinePolicy', {
      managedPolicyName: 'CodePipelinePolicy',
      statements: [
        new iam.PolicyStatement({
          actions: [
            's3:*',
            'ses:*',
            'ec2:*',
            'sns:Publish',
            'cloudformation:*',
            'kms:*',
            'dynamodb:*',
            'ecr:GetAuthorizationToken',
            'secretsmanager:GetRandomPassword',
            'secretsmanager:ListSecrets',
            'iam:PassRole',
            'cloudfront:*',
            'cognito-idp:*'
          ],
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          actions: ['ssm:GetParameterHistory', 'ssm:GetParametersByPath', 'ssm:GetParameters', 'ssm:GetParameter'],
          resources: [`arn:aws:ssm:${region}:${account}:parameter/*`],
        }),
        new iam.PolicyStatement({
          actions: ['rds:*'],
          resources: [`arn:aws:rds:${region}:${account}:*:*`, `arn:aws:rds:${region}:${account}:*:*/*/*`],
        }),
        new iam.PolicyStatement({
          actions: [
            'rds:AuthorizeDBSecurityGroupIngress',
            'rds:AddRoleToDBInstance',
            'rds:RemoveRoleFromDBCluster',
            'rds:AddRoleToDBCluster',
            'rds:RemoveRoleFromDBInstance',
          ],
          resources: ['*'],
          effect: iam.Effect.DENY,
        }),
        new iam.PolicyStatement({
          actions: ['iam:CreateServiceLinkedRole'],
          resources: [`arn:aws:iam::${account}:role/aws-service-role/rds.amazonaws.com/AWSServiceRoleForRDS`],
          conditions: {
            StringLike: {
              'iam:AWSServiceName': 'rds.amazonaws.com',
            },
          },
        }),
        new iam.PolicyStatement({
          actions: ['iam:CreateServiceLinkedRole'],
          resources: [
            `arn:aws:iam::${account}:role/aws-service-role/email.cognito-idp.amazonaws.com/AWSServiceRoleForAmazonCognitoIdpEmailService`,
            `arn:aws:iam::${account}:role/aws-service-role/email.cognito-idp.amazonaws.com/AWSServiceRoleForAmazonCognitoIdp`,
          ],
          conditions: {
            StringLike: {
              'iam:AWSServiceName': 'email.cognito-idp.amazonaws.com',
            },
          },
        }),
        new iam.PolicyStatement({
          actions: ['iam:CreateServiceLinkedRole'],
          resources: [
            `arn:aws:iam::${account}:role/aws-service-role/replication.ecr.amazonaws.com/ECRReplicationServiceRolePolicy`,
          ],
          conditions: {
            StringLike: {
              'iam:AWSServiceName': 'replication.ecr.amazonaws.com',
            },
          },
        }),
        new iam.PolicyStatement({
          actions: ['iam:CreateServiceLinkedRole'],
          resources: [
            `arn:aws:iam::${account}:role/aws-service-role/elasticloadbalancing.amazonaws.com/AWSServiceRoleForElasticLoadBalancing`,
          ],
          conditions: {
            StringLike: {
              'iam:AWSServiceName': 'elasticloadbalancing.amazonaws.com',
            },
          },
        }),
        new iam.PolicyStatement({
          actions: ['iam:CreateServiceLinkedRole'],
          resources: [
            `arn:aws:iam::${account}:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService`,
          ],
          conditions: {
            StringLike: {
              'iam:AWSServiceName': 'ecs.application-autoscaling.amazonaws.com',
            },
          },
        }),
        new iam.PolicyStatement({
          actions: ['iam:CreateServiceLinkedRole'],
          resources: [`arn:aws:iam::${account}:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS`],
          conditions: {
            StringLike: {
              'iam:AWSServiceName': 'ecs.amazonaws.com',
            },
          },
        }),
        new iam.PolicyStatement({
          actions: [
            'secretsmanager:GetSecretValue',
            'secretsmanager:DescribeSecret',
            'secretsmanager:RestoreSecret',
            'secretsmanager:PutSecretValue',
            'secretsmanager:CreateSecret',
            'secretsmanager:DeleteSecret',
            'secretsmanager:UpdateSecret',
          ],
          resources: [`arn:aws:secretsmanager:${region}:${account}:secret:*`],
        }),
        new iam.PolicyStatement({
          actions: [
            'ecr:PutImageTagMutability',
            'ecr:DescribeImageScanFindings',
            'ecr:StartImageScan',
            'ecr:PutImageScanningConfiguration',
            'ecr:DescribeImageReplicationStatus',
            'ecr:UploadLayerPart',
            'ecr:BatchDeleteImage',
            'ecr:PutImage',
            'ecr:BatchGetImage',
            'ecr:CompleteLayerUpload',
            'ecr:DescribeImages',
            'ecr:InitiateLayerUpload',
            'ecr:BatchCheckLayerAvailability',
            'ecr:ReplicateImage',
          ],
          resources: [`arn:aws:ecr:${region}:${account}:repository/*`],
        }),
        new iam.PolicyStatement({
          actions: [
            'events:DeleteRule',
            'events:DescribeRule',
            'events:EnableRule',
            'events:PutRule',
            'events:ListTargetsByRule',
            'events:DisableRule',
          ],
          resources: [`arn:aws:events:${region}:${account}:rule/*`, `arn:aws:events:${region}:${account}:rule/*/*`],
        }),
        new iam.PolicyStatement({
          actions: ['events:ListRuleNamesByTarget', 'events:ListRules'],
          resources: ['*'],
        }),
      ],
    });

    const codePipelinePolicyForCodeArtifact = new iam.ManagedPolicy(this, 'CodePipelinePolicyForCodeArtifact', {
      managedPolicyName: 'CodePipelinePolicyForCodeArtifact',
      statements: [
        new iam.PolicyStatement({
          actions: [
            'codeartifact:DescribePackage',
            'codeartifact:GetPackageVersionReadme',
            'codeartifact:ListTagsForResource',
            'codeartifact:DescribeRepository',
            'codeartifact:ListPackageVersionAssets',
            'codeartifact:DescribeDomain',
            'codeartifact:ListRepositoriesInDomain',
            'codeartifact:DescribePackageVersion',
            'codeartifact:GetDomainPermissionsPolicy',
            'codeartifact:ListPackageVersionDependencies',
            'codeartifact:ListPackages',
            'codeartifact:GetAuthorizationToken',
            'codeartifact:ReadFromRepository',
            'codeartifact:GetRepositoryEndpoint',
            'codeartifact:PublishPackageVersion',
            'codeartifact:GetPackageVersionAsset',
            'codeartifact:GetRepositoryPermissionsPolicy',
            'codeartifact:ListPackageVersions',
          ],
          resources: [
            `arn:aws:codeartifact:${region}:${account}:package/*/*/*/*/*`,
            `arn:aws:codeartifact:${region}:${account}:domain/*`,
            `arn:aws:codeartifact:${region}:${account}:repository/*/*`,
          ],
        }),
        new iam.PolicyStatement({
          actions: ['codeartifact:ListRepositories', 'codeartifact:ListDomains'],
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          actions: ['sts:GetServiceBearerToken'],
          resources: ['*'],
          conditions: {
            StringLike: {
              'iam:AWSServiceName': 'codeartifact.amazonaws.com',
            },
          },
        }),
      ],
    });

    const codePipelinePolicyForECS = new iam.ManagedPolicy(this, 'CodePipelinePolicyForECS', {
      managedPolicyName: 'CodePipelinePolicyForECS',
      statements: [
        new iam.PolicyStatement({
          actions: [
            'application-autoscaling:RegisterScalableTarget',
            'application-autoscaling:DescribeScalableTargets',
            'application-autoscaling:DeleteScalingPolicy',
            'application-autoscaling:DescribeScalingActivities',
            'application-autoscaling:DescribeScalingPolicies',
            'application-autoscaling:PutScalingPolicy',
            'application-autoscaling:DescribeScheduledActions',
            'application-autoscaling:DeregisterScalableTarget',
            'application-autoscaling:TagResource',
            'autoscaling:DeleteAutoScalingGroup',
            'autoscaling:CreateAutoScalingGroup',
            'autoscaling:CreateLaunchConfiguration',
            'autoscaling:DeleteLaunchConfiguration',
            'autoscaling:Describe*',
            'autoscaling:UpdateAutoScalingGroup',
            'ec2:DeleteLaunchTemplate',
            'ec2:CreateLaunchTemplate',
            'ec2:CancelSpotFleetRequests',
            'ec2:CreateTags',
            'ec2:Describe*',
            'ec2:RunInstances',
            'ec2:RequestSpotFleet',
            'elasticloadbalancing:DeleteLoadBalancer',
            'elasticloadbalancing:CreateListener',
            'elasticloadbalancing:CreateLoadBalancer',
            'elasticloadbalancing:Describe*',
            'elasticloadbalancing:CreateTargetGroup',
            'elasticloadbalancing:CreateRule',
            'elasticloadbalancing:DeleteListener',
            'elasticloadbalancing:AddTags',
            'events:DeleteRule',
            'events:PutTargets',
            'events:ListRuleNamesByTarget',
            'events:PutRule',
            'events:RemoveTargets',
            'events:Describe*',
            'route53:GetHostedZone',
            'route53:GetHealthCheck',
            'route53:ListHostedZonesByName',
            'sns:ListTopics',
          ],
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          actions: [
            'ecs:PutAttributes',
            'ecs:UpdateCluster',
            'ecs:ListAttributes',
            'ecs:ExecuteCommand',
            'ecs:UpdateContainerInstancesState',
            'ecs:UpdateTaskProtection',
            'ecs:StartTask',
            'ecs:RegisterContainerInstance',
            'ecs:DescribeTaskSets',
            'ecs:DescribeTaskDefinition',
            'ecs:DeleteCapacityProvider',
            'ecs:SubmitAttachmentStateChanges',
            'ecs:Poll',
            'ecs:CreateService',
            'ecs:UpdateService',
            'ecs:DescribeCapacityProviders',
            'ecs:DescribeServices',
            'ecs:SubmitContainerStateChange',
            'ecs:DescribeContainerInstances',
            'ecs:DeregisterContainerInstance',
            'ecs:DeleteTaskDefinitions',
            'ecs:TagResource',
            'ecs:DescribeTasks',
            'ecs:UntagResource',
            'ecs:PutClusterCapacityProviders',
            'ecs:UpdateTaskSet',
            'ecs:SubmitTaskStateChange',
            'ecs:GetTaskProtection',
            'ecs:UpdateClusterSettings',
            'ecs:UpdateCapacityProvider',
            'ecs:DeleteService',
            'ecs:DeleteCluster',
            'ecs:DeleteTaskSet',
            'ecs:DescribeClusters',
            'ecs:ListTagsForResource',
            'ecs:UpdateServicePrimaryTaskSet',
          ],
          resources: [
            `arn:aws:ecs:${region}:${account}:task-set/*/*/*`,
            `arn:aws:ecs:${region}:${account}:task-definition/*:*`,
            `arn:aws:ecs:${region}:${account}:task/*/*`,
            `arn:aws:ecs:${region}:${account}:service/*/*`,
            `arn:aws:ecs:${region}:${account}:capacity-provider/*`,
            `arn:aws:ecs:${region}:${account}:container-instance/*/*`,
            `arn:aws:ecs:${region}:${account}:cluster/*`,
          ],
        }),
        new iam.PolicyStatement({
          actions: [
            'ecs:ListServicesByNamespace',
            'ecs:DiscoverPollEndpoint',
            'ecs:PutAccountSettingDefault',
            'ecs:CreateCluster',
            'ecs:DescribeTaskDefinition',
            'ecs:PutAccountSetting',
            'ecs:ListServices',
            'ecs:CreateCapacityProvider',
            'ecs:DeregisterTaskDefinition',
            'ecs:ListAccountSettings',
            'ecs:DeleteAccountSetting',
            'ecs:ListTaskDefinitionFamilies',
            'ecs:RegisterTaskDefinition',
            'ecs:ListTaskDefinitions',
            'ecs:CreateTaskSet',
            'ecs:ListClusters',
          ],
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          actions: ['iam:ListAttachedRolePolicies'],
          resources: [`arn:aws:iam::${account}:role/*`],
        }),
        new iam.PolicyStatement({
          actions: ['iam:ListRoles', 'iam:ListInstanceProfiles'],
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          actions: ['elasticloadbalancing:ModifyLoadBalancerAttributes'],
          resources: [`arn:aws:elasticloadbalancing:${region}:${account}:loadbalancer/*`],
        }),
        new iam.PolicyStatement({
          actions: [
            'elasticloadbalancing:RegisterTargets',
            'elasticloadbalancing:AddTags',
            'elasticloadbalancing:CreateTargetGroup',
            'elasticloadbalancing:DeregisterTargets',
            'elasticloadbalancing:ModifyLoadBalancerAttributes',
            'elasticloadbalancing:DeleteTargetGroup',
            'elasticloadbalancing:ModifyTargetGroupAttributes',
            'elasticloadbalancing:ModifyTargetGroup',
          ],
          resources: [
            `arn:aws:elasticloadbalancing:${region}:${account}:listener/net/*/*/*`,
            `arn:aws:elasticloadbalancing:${region}:${account}:truststore/*/*`,
            `arn:aws:elasticloadbalancing:${region}:${account}:targetgroup/*/*`,
            `arn:aws:elasticloadbalancing:${region}:${account}:loadbalancer/net/*/*`,
            `arn:aws:elasticloadbalancing:${region}:${account}:loadbalancer/app/*/*`,
            `arn:aws:elasticloadbalancing:${region}:${account}:listener-rule/net/*/*/*/*`,
            `arn:aws:elasticloadbalancing:${region}:${account}:listener-rule/app/*/*/*/*`,
          ],
        }),
        new iam.PolicyStatement({
          actions: ['elasticloadbalancing:DescribeTargetGroupAttributes', 'elasticloadbalancing:DescribeTargetHealth'],
          resources: ['*'],
        }),
      ],
    });

    const codePipelineRole = new iam.Role(this, 'CodePipelineRole', {
      roleName: 'CodePipelineRole',
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('cloudformation.amazonaws.com'),
        new iam.ServicePrincipal('codepipeline.amazonaws.com'),
        new iam.ServicePrincipal('codebuild.amazonaws.com'),
        new iam.ServicePrincipal('codedeploy.amazonaws.com'),
      ),
    });

    codePipelineRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonAPIGatewayAdministrator'));
    codePipelineRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSCodeBuildAdminAccess'));
    codePipelineRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSCodeCommitFullAccess'));
    codePipelineRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSCodePipeline_FullAccess'));
    codePipelineRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSLambda_FullAccess'));
    codePipelineRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchEventsFullAccess'));
    codePipelineRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchFullAccessV2'));
    codePipelineRole.addManagedPolicy(codePipelinePolicy);
    codePipelineRole.addManagedPolicy(codePipelinePolicyForCodeArtifact);
    codePipelineRole.addManagedPolicy(codePipelinePolicyForECS);
  }
}
