#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Context, Env, contextMap } from '../context';
import { PipelineStack } from '../lib/pipeline-stack';
import { APIStack } from '../lib/api-stack';

const app = new cdk.App();
const env = app.node.tryGetContext('env') as Env;
const context = contextMap.get(env) as Context;
const imageTag = app.node.tryGetContext('imageTag') as string;
context.ecrImageTag = imageTag;

// pipeline
const pipelineSynthesizer = new cdk.CliCredentialsStackSynthesizer({
  fileAssetsBucketName: context.fileAssetsBucketName,
  bucketPrefix: `cdk-${context.apiName}-pipeline${context.suffix}`,
  qualifier: `cdk-${context.apiName}-pipeline${context.suffix}`,
});
const pipelineStackName = `${context.apiName}-pipeline${context.suffix}`;
new PipelineStack(app, pipelineStackName, context, {
  stackName: pipelineStackName,
  synthesizer: pipelineSynthesizer,
  env: {
    account: context.account,
    region: context.region,
  },
});

// api
const apiSynthesizer = new cdk.CliCredentialsStackSynthesizer({
  fileAssetsBucketName: context.fileAssetsBucketName,
  bucketPrefix: `cdk-${context.apiName}${context.suffix}`,
  qualifier: `cdk-${context.apiName}${context.suffix}`,
});
const apiStackName = `${context.apiName}${context.suffix}`;
new APIStack(app, apiStackName, context, {
  stackName: apiStackName,
  synthesizer: apiSynthesizer,
  env: {
    account: context.account,
    region: context.region,
  },
});
