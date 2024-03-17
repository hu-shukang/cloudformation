import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class DevAccessRoleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const account = props?.env?.account as string;

    const devAccessPolicy = new iam.ManagedPolicy(this, 'DevAccessPolicy', {
      managedPolicyName: 'DevAccessPolicy',
      statements: [
        new iam.PolicyStatement({
          notActions: ['iam:*', 'organizations:*', 'ec2:*Vpc*', 'ec2:*SecurityGroup*', 's3:*'],
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          actions: [
            'kms:Encrypt',
            'kms:Decrypt',
            'aws-portal:ViewBilling',
            'aws-portal:ModifyBilling',
            'budgets:ViewBudget',
            'budgets:ModifyBudget',
            'dynamodb:*',
            'rds:*',
          ],
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          actions: [
            'aws-marketplace:StartChangeSet',
            'aws-marketplace:DescribeChangeSet',
            'dataexchange:PublishDataSet',
            'ecr:SetRepositoryPolicy',
            'cloudshell:*',
            'ssm:*Activation*',
          ],
          resources: ['*'],
          effect: iam.Effect.DENY,
        }),
        new iam.PolicyStatement({
          actions: [
            'organizations:DescribeOrganization',
            'ec2:Describe*',
            's3:Get*',
            's3:PutObject',
            's3:List*',
            's3:DeleteObject',
          ],
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          actions: ['iam:GetRole', 'iam:PassRole'],
          resources: [
            `arn:aws:iam::${account}:role/LambdaAccessRole`,
            `arn:aws:iam::${account}:role/CodePipelineRole`,
            `arn:aws:iam::${account}:role/ECSTaskExecutionRole`,
            `arn:aws:iam::${account}:role/EventBridgeForCodePipelineRole`,
          ],
        }),
        new iam.PolicyStatement({
          actions: ['iam:CreateServiceLinkedRole'],
          resources: [`arn:aws:iam::${account}:role/ecs.amazonaws.com/AWSServiceRoleForECS*`],
          conditions: {
            StringLike: {
              'iam:AWSServiceName': 'ecs.amazonaws.com',
            },
          },
        }),
        new iam.PolicyStatement({
          actions: ['iam:CreateServiceLinkedRole'],
          resources: [
            `arn:aws:iam::${account}:role/elasticloadbalancing.amazonaws.com/AWSServiceRoleForElasticLoadBalancing`,
          ],
          conditions: {
            StringLike: {
              'iam:AWSServiceName': 'elasticloadbalancing.amazonaws.com',
            },
          },
        }),
        new iam.PolicyStatement({
          actions: ['iam:CreateServiceLinkedRole'],
          resources: [`arn:aws:iam::${account}:role/replication.ecr.amazonaws.com/AWSServiceRoleForECRReplication`],
          conditions: {
            StringLike: {
              'iam:AWSServiceName': 'replication.ecr.amazonaws.com',
            },
          },
        }),
        new iam.PolicyStatement({
          actions: ['iam:PassRole'],
          resources: [
            `arn:aws:iam::${account}:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService`,
          ],
        }),
      ],
    });

    const devAccessRole = new iam.Role(this, 'DevAccessRole', {
      roleName: 'DevAccessRole',
      assumedBy: new iam.AccountRootPrincipal(),
    });

    devAccessRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSSupportAccess'));

    devAccessRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('IAMReadOnlyAccess'));
    devAccessRole.addManagedPolicy(devAccessPolicy);
  }
}
