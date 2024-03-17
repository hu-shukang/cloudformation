import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class S3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const { appName, env } = props!.env!;

    new s3.Bucket(this, `${appName}-${env}-web-dev`, {
      bucketName: `${appName}-${env}-web-dev`,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
    });

    new s3.Bucket(this, `${appName}-${env}-work-dev`, {
      bucketName: `${appName}-${env}-work-dev`,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    new s3.Bucket(this, `${appName}-${env}-log-dev`, {
      bucketName: `${appName}-${env}-log-dev`,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    new s3.Bucket(this, `${appName}-${env}-unyo-dev`, {
      bucketName: `${appName}-${env}-unyo-dev`,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    new s3.Bucket(this, `${appName}-${env}-contents-dev`, {
      bucketName: `${appName}-${env}-contents-dev`,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });
  }
}
