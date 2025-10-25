import * as cdk from "aws-cdk-lib";
import { Stack } from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { ApiRoute, ApiRouteProps, RequestSchema } from "../constructs/ApiRoute";

export type Route = {
  name: string;
  type: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  route: string | string[];
  lambda: lambda.IFunction;
  secured: boolean;
  requestSchema?: RequestSchema;
};

type Props = {
  userPool: UserPool;
  stage: string;
  routes: Route[];
};

export const createAPIGateway = (
  stack: Stack,
  { userPool, stage, routes }: Props,
) => {
  const api = new apigateway.RestApi(stack, `Api-${stage}`, {
    restApiName: `DataGuardAPI-${stage}-${stack.stackName}`,
    deploy: false,
    defaultCorsPreflightOptions: {
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: apigateway.Cors.ALL_METHODS,
      allowHeaders: ["Content-Type", "Authorization"],
    },
  });

  const authorizer = new apigateway.CognitoUserPoolsAuthorizer(
    stack,
    `Authorizer-${stage}`,
    {
      cognitoUserPools: [userPool],
    },
  );

  for (const r of routes) {
    const baseProps = {
      api,
      name: `${r.name}-${stage}`,
      route: r.route,
      lambda: r.lambda,
      type: r.type,
    };

    const props: ApiRouteProps = r.secured
      ? { ...baseProps, secured: true, authorizer }
      : { ...baseProps, secured: false };

    new ApiRoute(stack, props);
  }

  const deployment = new apigateway.Deployment(
    stack,
    `ApiDeployment-${stage}`,
    { api },
  );

  const stageObject = new apigateway.Stage(stack, `ApiStage-${stage}`, {
    deployment,
    stageName: stage,
  });

  api.deploymentStage = stageObject;

  new cdk.CfnOutput(stack, `ApiUrl-${stage}`, {
    value: `${api.url}${stage}/`,
  });
};
