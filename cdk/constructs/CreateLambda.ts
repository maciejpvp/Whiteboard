import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";

export interface ResourceConfig {
  grant: (lambdaFn: lambda.IFunction) => void;
  envName?: string;
  envValue?: string;
}

export interface CreateLambdaProps {
  name: string;
  stage: string;
  grantWsAccess?: boolean;
  env?: Record<string, string>;
  resources?: ResourceConfig[];
}

export class CreateLambda extends Construct {
  public readonly lambdaFunction: NodejsFunction;
  public readonly grantWsAccess: boolean;

  constructor(scope: Construct, props: CreateLambdaProps) {
    super(scope, props.name);

    this.grantWsAccess = props.grantWsAccess ?? false;

    const { name, stage, env = {}, resources = [] } = props;

    this.lambdaFunction = new NodejsFunction(this, `${name}-${stage}`, {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, `../src/lambdas/${name}/${name}.ts`),
      handler: "handler",
      environment: {
        STAGE: stage,
        ...env,
      },
    });

    for (const { grant, envName, envValue } of resources) {
      if (envName && envValue) {
        this.lambdaFunction.addEnvironment(envName, envValue);
      }
      grant(this.lambdaFunction);
    }
  }
}
