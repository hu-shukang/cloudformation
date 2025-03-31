import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class AmplifySSRLoggingRoleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const account = props?.env?.account as string;
    const region = props?.env?.region as string;

    const policy = new iam.ManagedPolicy(this, 'AmplifySSRLoggingPolicy', {
      managedPolicyName: 'AmplifySSRLoggingPolicy',
      statements: [
        new iam.PolicyStatement({
          actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
          resources: [`arn:aws:logs:${region}:${account}:log-group:/aws/amplify/*:log-stream:*`],
        }),
        new iam.PolicyStatement({
          actions: ['logs:CreateLogGroup'],
          resources: [`arn:aws:logs:${region}:${account}:log-group:/aws/amplify/*`],
        }),
        new iam.PolicyStatement({
          actions: ['logs:DescribeLogGroups'],
          resources: [`arn:aws:logs:${region}:${account}:log-group:*`],
        }),
      ],
    });

    const role = new iam.Role(this, 'AmplifySSRLoggingRole', {
      roleName: 'AmplifySSRLoggingRole',
      description: 'The service role that will be used by AWS Amplify for Web Compute app logging',
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('amplify.amazonaws.com'),
      ),
    });

    role.addManagedPolicy(iam.ManagedPolicy.fromManagedPolicyArn(this, 'AmplifyBackendDeployFullAccess', 'arn:aws:iam::aws:policy/service-role/AmplifyBackendDeployFullAccess'));
    role.addManagedPolicy(policy);
  }
}
