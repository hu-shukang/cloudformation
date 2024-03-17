import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class DevUserGroupStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const userGroup = new iam.Group(this, 'DevUserGroup', {
      groupName: 'DevUserGroup',
    });
    userGroup.addManagedPolicy(
      iam.ManagedPolicy.fromManagedPolicyArn(
        this,
        'DevAccessPolicy',
        'arn:aws:iam::471112651100:policy/DevAccessPolicy',
      ),
    );
    userGroup.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSSupportAccess'));
    userGroup.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('IAMReadOnlyAccess'));
  }
}
