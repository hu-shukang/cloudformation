import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Context } from '../context';
import { Role } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipelineActions from 'aws-cdk-lib/aws-codepipeline-actions';

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, context: Context, props?: cdk.StackProps) {
    super(scope, id, props);
    const suffix = context.suffix;

    const codePipelineRole = Role.fromRoleArn(this, `CodePipelineRole${suffix}`, context.codePipelineRoleArn, {
      mutable: false,
    });
    const eventBridgeRole = Role.fromRoleArn(this, `EventBridgeRole${suffix}`, context.eventBridgeRoleArn, {
      mutable: false,
    });
    const artifactBucket = Bucket.fromBucketName(this, `ArtifactBucket${suffix}`, context.fileAssetsBucketName);
    const template = `${context.apiName}-template${suffix}.yaml`;

    const repository = codecommit.Repository.fromRepositoryName(
      this,
      `CodeCommitRepository${suffix}`,
      context.codeCommitRepositoryName,
    );

    const buildProject = new codebuild.PipelineProject(this, `BuildProject${suffix}`, {
      projectName: `${context.apiName}-build-project${suffix}`,
      role: codePipelineRole,
      queuedTimeout: cdk.Duration.hours(0.5),
      timeout: cdk.Duration.hours(1),
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_5,
        computeType: codebuild.ComputeType.SMALL,
        privileged: true, // Enable privileged mode to allow Docker commands
        environmentVariables: {
          ENV: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: context.env,
          },
          TEMPLATE_FILENAME: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: template,
          },
          ECR_REPOSITORY_URI: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: context.ecrRepositoryURI,
          },
        },
      },
      buildSpec: codebuild.BuildSpec.fromSourceFilename(context.buildSpecFileName),
    });

    const pipeline = new codepipeline.Pipeline(this, `Pipeline${suffix}`, {
      pipelineName: `${context.apiName}-pipeline${suffix}`,
      artifactBucket: artifactBucket,
      role: codePipelineRole,
    });

    const sourceArtifact = new codepipeline.Artifact('sourceArtifact');
    const buildArtifact = new codepipeline.Artifact('buildArtifact');

    const sourceAction = new codepipelineActions.CodeCommitSourceAction({
      actionName: 'CodeCommit',
      repository: repository,
      branch: context.branch,
      output: sourceArtifact,
      role: codePipelineRole,
      eventRole: eventBridgeRole,
      trigger: codepipelineActions.CodeCommitTrigger.EVENTS,
    });

    const buildAction = new codepipelineActions.CodeBuildAction({
      actionName: 'CodeBuild',
      input: sourceArtifact,
      outputs: [buildArtifact],
      project: buildProject,
      role: codePipelineRole,
    });

    const deployAction = new codepipelineActions.CloudFormationCreateUpdateStackAction({
      actionName: 'CloudFormation-CreateUpdateStack',
      stackName: `${context.apiName}${suffix}`,
      adminPermissions: true,
      templatePath: buildArtifact.atPath(template),
      deploymentRole: codePipelineRole,
      replaceOnFailure: true,
      role: codePipelineRole,
    });

    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction],
    });

    pipeline.addStage({
      stageName: 'Build',
      actions: [buildAction],
    });

    pipeline.addStage({
      stageName: 'Deploy',
      actions: [deployAction],
    });
  }
}
