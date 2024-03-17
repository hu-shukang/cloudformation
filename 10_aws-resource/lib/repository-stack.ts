import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';

export class RepositoryStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const { appName } = props!.env!;

    new ecr.Repository(this, `${appName}-ECR-Repository`, { repositoryName: appName });

    new codecommit.Repository(this, `${appName}-API-Repository`, { repositoryName: `${appName}-api` });
    new codecommit.Repository(this, `${appName}-Client-Repository`, { repositoryName: `${appName}-client` });
    new codecommit.Repository(this, `${appName}-Admin-Client-Repository`, {
      repositoryName: `${appName}-admin-client`,
    });
    new codecommit.Repository(this, `${appName}-Doc-Repository`, {
      repositoryName: `${appName}-doc`,
    });
  }
}
