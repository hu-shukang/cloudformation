#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LambdaAccessRoleStack } from '../lib/lambda-access-role-stack';
import { ECSTaskRoleStack } from '../lib/ecs-task-role-stack';
import { ECSTaskExecutionRole } from '../lib/ecs-execution-task-role-stack';
import { CodePipelineRoleStack } from '../lib/codepipeline-role-stack';
import { DevAccessRoleStack } from '../lib/dev-access-role-stack';
import { DevUserGroupStack } from '../lib/dev-user-group-stack';
import { S3Stack } from '../lib/s3-stack';
import { RepositoryStack } from '../lib/repository-stack';
import { VPCStack } from '../lib/vpc-stack';
import { EventBridgeForCodePipelineRoleStack } from '../lib/event-bridge-for-code-pipeline-role-stack';
import { Context, context } from './context';
import { AmplifySSRLoggingRoleStack } from '../lib/amplify-ssr-logging-role-stack';

declare module 'aws-cdk-lib' {
  interface Environment extends Context {}
}

const app = new cdk.App({
  defaultStackSynthesizer: new cdk.CliCredentialsStackSynthesizer({
    fileAssetsBucketName: 'hsk-cdk', // CDK資源用のS3 Bucket
    bucketPrefix: 'aws-resource',
    qualifier: 'aws-resource',
  }),
});

const env = app.node.tryGetContext('env') as string;
const props: cdk.StackProps = {
  env: { ...context, env: env },
};
// role
new CodePipelineRoleStack(app, 'CodePipelineRoleStack', props);
new LambdaAccessRoleStack(app, 'LambdaAccessRoleStack', props);
new ECSTaskRoleStack(app, 'ECSTaskRoleStack', props);
new ECSTaskExecutionRole(app, 'ECSTaskExecutionRole', props);
new DevAccessRoleStack(app, 'DevAccessRoleStack', props);
new EventBridgeForCodePipelineRoleStack(app, 'EventBridgeForCodePipelineRoleStack', props);
new AmplifySSRLoggingRoleStack(app, 'AmplifySSRLoggingRoleStack', props);

// user group
new DevUserGroupStack(app, 'DevUserGroupStack', props);

// infra
new RepositoryStack(app, `RepositoryStack`, props);
new S3Stack(app, `S3Stack-${env}`, props);
new VPCStack(app, `VPCStack-${env}`, props);
