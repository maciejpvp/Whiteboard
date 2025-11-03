import * as cdk from "aws-cdk-lib";
import { Stack } from "aws-cdk-lib";
import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as authorizers from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import { createLambdas } from "./createLambdas";

export const createWebSocketAPI = (
  stack: Stack,
  lambdas: ReturnType<typeof createLambdas>,
  stage: string,
) => {
  const wsAuthorizer = new authorizers.WebSocketLambdaAuthorizer(
    `WsLambdaAuthorizer-${stage}`,
    lambdas.authorizer.lambdaFunction,
    {
      identitySource: ["route.request.querystring.Authorization"],
      authorizerName: `WsAuthorizer-${stage}`,
    },
  );

  const wsApi = new apigatewayv2.WebSocketApi(stack, `WebSocketApi-${stage}`, {
    connectRouteOptions: {
      integration: new integrations.WebSocketLambdaIntegration(
        `ConnectIntegration-${stage}`,
        lambdas.connectWS.lambdaFunction,
      ),
      authorizer: wsAuthorizer,
    },
    disconnectRouteOptions: {
      integration: new integrations.WebSocketLambdaIntegration(
        `DisconnectIntegration-${stage}`,
        lambdas.disconnectWS.lambdaFunction,
      ),
    },
  });

  const stageRes = new apigatewayv2.WebSocketStage(
    stack,
    `WebSocketStage-${stage}`,
    {
      webSocketApi: wsApi,
      stageName: stage,
      autoDeploy: true,
    },
  );

  new cdk.CfnOutput(stack, `WebSocketUrl-${stage}`, {
    value: wsApi.apiEndpoint,
  });

  const endpoint = `https://${wsApi.apiId}.execute-api.${stack.region}.amazonaws.com/${stage}`;

  return { wsApi, stageRes, endpoint };
};
