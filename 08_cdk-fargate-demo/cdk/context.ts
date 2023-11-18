export type Env = 'it' | 'st';

export type Context = {
  apiName: string;
  account: string;
  region: string;
  env: Env;
  suffix: string;
  branch: string;
  codePipelineRoleArn: string;
  eventBridgeRoleArn: string;
  ecsTaskExecutionRoleArn: string;
  ecsTaskRoleArn: string;
  fileAssetsBucketName: string;
  codeCommitRepositoryName: string;
  ecrRepositoryURI: string;
  buildSpecFileName: string;
  vpcCIDR: string;
  publicSubnetACIDR: string;
  publicSubnetCCIDR: string;
  protectedSubnetACIDR: string;
  protectedSubnetCCIDR: string;
  ecrImageTag: string;
};

const defaultContext = {
  apiName: 'fargate-demo-api',
  account: '146114061358',
  region: 'ap-northeast-1',
  codePipelineRoleArn: 'arn:aws:iam::146114061358:role/CodePipelineRole',
  eventBridgeRoleArn: 'arn:aws:iam::146114061358:role/EventBridgeForCodePipelineRole',
  ecsTaskExecutionRoleArn: 'arn:aws:iam::146114061358:role/ECSTaskExecutionRole',
  ecsTaskRoleArn: 'arn:aws:iam::146114061358:role/ECSTaskRole',
  codeCommitRepositoryName: 'fargate-demo-api',
  ecrRepositoryURI: '146114061358.dkr.ecr.ap-northeast-1.amazonaws.com/fargate-demo-api',
  buildSpecFileName: 'buildspec-dev.yaml',
  ecrImageTag: '',
};

const itContext: Context = {
  ...defaultContext,
  env: 'it',
  suffix: '-it',
  branch: 'it',
  fileAssetsBucketName: 'fargate-demo-api-it-work-dev',
  vpcCIDR: '10.39.165.0/24',
  publicSubnetACIDR: '10.39.165.0/26',
  publicSubnetCCIDR: '10.39.165.64/26',
  protectedSubnetACIDR: '10.39.165.128/26',
  protectedSubnetCCIDR: '10.39.165.192/26',
};

export const contextMap = new Map<Env, Context>([['it', itContext]]);
