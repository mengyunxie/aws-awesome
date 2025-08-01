import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep } from 'aws-cdk-lib/pipelines';
import { MyPipelineAppStage } from './stage';

export class CodePipelineWithCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'TestPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub(
          'mengyunxie/aws-awesome', 
          'main'),
        commands: [
          // Move into the subdirectory
          'cd codePipelineWithCDK',

          // Install dependencies and synth
          'npm ci',
          'npm run build',
          'npx cdk synth'
        ],
        primaryOutputDirectory: 'codePipelineWithCDK/cdk.out' // This tells it where to find the output
      }),
    });

    const testingStage = pipeline.addStage(new MyPipelineAppStage(this, "test", {
      env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
    }))

    testingStage.addPost(new ManualApprovalStep('Manual approval before production'));

    const prodStage = pipeline.addStage(new MyPipelineAppStage(this, "prod", {
      env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
    }))

  }
}
