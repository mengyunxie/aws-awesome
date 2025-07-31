#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CodePipelineWithCdkStack } from '../lib/code_pipeline_with_cdk-stack';

const app = new cdk.App();
new CodePipelineWithCdkStack(app, 'CodePipelineWithCdkStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
});
app.synth();