#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { APIStack } from '../lib/api-stack';
import { PipelineStack } from '../lib/pipeline-stack';
import { Env, contextMap } from '../context';

const app = new cdk.App();
const env = app.node.tryGetContext('env') as Env;
const imageTag = app.node.tryGetContext('imageTag') as string;
const context = contextMap.get(env);

if (!context) {
  throw new Error('no context data');
}

context.ecrImageTag = imageTag;

new APIStack(app, `${context.apiName}-api-${env}`, context, {
  stackName: `${context.apiName}-api-${env}`,
  synthesizer: new cdk.CliCredentialsStackSynthesizer({
    fileAssetsBucketName: context.fileAssetsBucketName,
    bucketPrefix: `cdk-api${context.suffix}`,
    qualifier: `cdk-api${context.suffix}`,
  }),
  env: {
    account: context.account,
    region: context.region,
  },
});

new PipelineStack(app, `${context.apiName}-pipeline-${env}`, context, {
  stackName: `${context.apiName}-pipeline-${env}`,
  synthesizer: new cdk.CliCredentialsStackSynthesizer({
    fileAssetsBucketName: context.fileAssetsBucketName,
    bucketPrefix: `cdk-pipeline${context.suffix}`,
    qualifier: `cdk-pipeline${context.suffix}`,
  }),
  env: {
    account: context.account,
    region: context.region,
  },
});
