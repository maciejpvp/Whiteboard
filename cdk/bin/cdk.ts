#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { WhiteboardStack } from "../lib/cdk-stack";

const app = new cdk.App();

// Stack test
new WhiteboardStack(app, "DataGuardTestStack", {
  stage: "test",
});

// Stack prod
new WhiteboardStack(app, "DataGuardProdStack", {
  stage: "prod",
});

app.synth();

