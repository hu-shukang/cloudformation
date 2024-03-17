export type Env = 'it' | 'st' | 'uat' | 'prod';

export type Context = {
  apiName: string;
  account: string;
  region: string;
  env: Env;
  suffix: string;
  branch: string;
  fileAssetsBucketName: string;
  codeCommitRepositoryName: string;
  ecrRepositoryURI: string;
  buildSpecFileName: string;
  ecrImageTag: string;
  desiredCount: number;
  minCapacity: number;
  // role
  codePipelineRoleArn: string;
  eventBridgeRoleArn: string;
  ecsTaskExecutionRoleArn: string;
  ecsTaskRoleArn: string;
  lambdaAccessRoleArn: string;
  // vpc
  vpcId: string;
  albSecurityGroup: string;
  ecsSecurityGroup: string;
  rdsSecurityGroup: string;
  rdsSubnetGroupName: string;
  publicSubnetIdA: string;
  publicSubnetIdC: string;
  protectedSubnetIdA: string;
  protectedSubnetIdC: string;
  privateSubnetIdA: string;
  privateSubnetIdC: string;
};

/** アプリ名 */
const apiName = 'tanso';
/** リージョン */
const region = 'ap-northeast-1';

/**
 * デフォルトのContext作成
 * @param account AWSアカウント
 * @param env 環境
 * @returns Context
 */
const getDefaultContext = (account: string, env: Env) => {
  return {
    env: env,
    branch: env,
    apiName: apiName,
    account: account,
    region: region,
    codePipelineRoleArn: `arn:aws:iam::${account}:role/CodePipelineRole`,
    eventBridgeRoleArn: `arn:aws:iam::${account}:role/EventBridgeForCodePipelineRole`,
    ecsTaskExecutionRoleArn: `arn:aws:iam::${account}:role/ECSTaskExecutionRole`,
    ecsTaskRoleArn: `arn:aws:iam::${account}:role/ECSTaskRole`,
    lambdaAccessRoleArn: `arn:aws:iam::${account}:role/LambdaAccessRole`,
    codeCommitRepositoryName: `${apiName}-api`,
    ecrRepositoryURI: `${account}.dkr.ecr.${region}.amazonaws.com/${apiName}`,
    buildSpecFileName: 'buildspec-dev.yaml',
    ecrImageTag: '',
    desiredCount: 1,
    minCapacity: 1,
  };
};

const itContext: Context = {
  ...getDefaultContext('xxx', 'it'), // アカウント
  suffix: '-it',
  fileAssetsBucketName: `${apiName}-it-work-dev`,
  vpcId: '',
  albSecurityGroup: '',
  ecsSecurityGroup: '',
  rdsSecurityGroup: '',
  rdsSubnetGroupName: '',
  publicSubnetIdA: '',
  publicSubnetIdC: '',
  protectedSubnetIdA: '',
  protectedSubnetIdC: '',
  privateSubnetIdA: '',
  privateSubnetIdC: '',
};

const stContext: Context = {
  ...getDefaultContext('xxx', 'st'),
  suffix: '-st',
  fileAssetsBucketName: `${apiName}-st-work-dev`,
  vpcId: '',
  albSecurityGroup: '',
  ecsSecurityGroup: '',
  rdsSecurityGroup: '',
  rdsSubnetGroupName: '',
  publicSubnetIdA: '',
  publicSubnetIdC: '',
  protectedSubnetIdA: '',
  protectedSubnetIdC: '',
  privateSubnetIdA: '',
  privateSubnetIdC: '',
};

const uatContext: Context = {
  ...getDefaultContext('xxx', 'uat'),
  suffix: '',
  fileAssetsBucketName: `${apiName}-work-dev`,
  vpcId: '',
  albSecurityGroup: '',
  ecsSecurityGroup: '',
  rdsSecurityGroup: '',
  rdsSubnetGroupName: '',
  publicSubnetIdA: '',
  publicSubnetIdC: '',
  protectedSubnetIdA: '',
  protectedSubnetIdC: '',
  privateSubnetIdA: '',
  privateSubnetIdC: '',
};

const prodContext: Context = {
  ...getDefaultContext('xxx', 'prod'),
  suffix: '',
  fileAssetsBucketName: `${apiName}-work-prod`,
  vpcId: '',
  albSecurityGroup: '',
  ecsSecurityGroup: '',
  rdsSecurityGroup: '',
  rdsSubnetGroupName: '',
  publicSubnetIdA: '',
  publicSubnetIdC: '',
  protectedSubnetIdA: '',
  protectedSubnetIdC: '',
  privateSubnetIdA: '',
  privateSubnetIdC: '',
};

export const contextMap: Map<Env, Context> = new Map([
  ['it', itContext],
  ['st', stContext],
  ['uat', uatContext],
  ['prod', prodContext],
]);
