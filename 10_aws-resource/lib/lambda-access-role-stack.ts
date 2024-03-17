import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class LambdaAccessRoleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaAccessPolicy = new iam.ManagedPolicy(this, 'LambdaAccessPolicy', {
      managedPolicyName: 'LambdaAccessPolicy',
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['s3:GetBucketLocation', 's3:ListAllMyBuckets', 's3:ListBucket'],
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['s3:*'],
          resources: [
            'arn:aws:s3:::*web*',
            'arn:aws:s3:::*web*/*',
            'arn:aws:s3:::*work*',
            'arn:aws:s3:::*work*/*',
            'arn:aws:s3:::*log*',
            'arn:aws:s3:::*log*/*',
            'arn:aws:s3:::*unyo*',
            'arn:aws:s3:::*unyo*/*',
            'arn:aws:s3:::*deploy*',
            'arn:aws:s3:::*deploy*/*',
            'arn:aws:s3:::*contents*',
            'arn:aws:s3:::*contents*/*',
          ],
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'logs:*',
            'ssm:*',
            'ssm:*',
            'lambda:*',
            'sns:*',
            'dynamodb:*',
            'secretsmanager:*',
            'kms:*',
            'ses:*',
            'ec2:Describe*',
            'ec2:DeregisterImage',
            'ec2:DeleteSnapshot',
            'ec2:TerminateInstances',
            'ec2:DeleteTags',
            'ec2:StartInstances',
            'ec2:DescribeTags',
            'ec2:CreateTags',
            'ec2:CreateImage',
            'ec2:RunInstances',
            'ec2:CopyImage',
            'ec2:StopInstances',
            'ec2:TerminateInstances',
            'ec2:CreateNetworkInterface',
            'ec2:DetachNetworkInterface',
            'ec2:DescribeNetworkInterfaces',
            'ec2:ResetNetworkInterfaceAttribute',
            'ec2:ModifyNetworkInterfaceAttribute',
            'ec2:DeleteNetworkInterface',
            'ec2:AttachNetworkInterface',
          ],
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['iam:PassRole'],
          resources: ['*'],
        }),
      ],
    });

    const lambdaAccessRole = new iam.Role(this, 'LambdaAccessRole', {
      roleName: 'LambdaAccessRole',
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('lambda.amazonaws.com'),
        new iam.ServicePrincipal('apigateway.amazonaws.com'),
      ),
    });

    lambdaAccessRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSXrayWriteOnlyAccess'));

    lambdaAccessRole.addManagedPolicy(lambdaAccessPolicy);
  }
}
