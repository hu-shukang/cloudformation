import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class EventBridgeForCodePipelineRoleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const { region, account } = props!.env!;

    const eventBridgeRole = new iam.Role(this, 'EventBridgeForCodePipelineRole', {
      roleName: 'EventBridgeForCodePipelineRole',
      assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
    });

    const eventBridgeForCodePipelinePolicy = new iam.ManagedPolicy(this, 'EventBridgeForCodePipelinePolicy', {
      managedPolicyName: 'EventBridgeForCodePipelinePolicy',
      statements: [
        new iam.PolicyStatement({
          actions: ['codepipeline:StartPipelineExecution'],
          resources: [`arn:aws:codepipeline:${region}:${account}:*`],
        }),
      ],
    });

    eventBridgeRole.addManagedPolicy(eventBridgeForCodePipelinePolicy);
  }
}
