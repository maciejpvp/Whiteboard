import { aws_dynamodb, Stack } from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { CreateLambda, CreateLambdaProps } from "../constructs/CreateLambda";

type Props = {
  whiteboardTable: aws_dynamodb.Table;
  stage: string;
  connectionsTable: aws_dynamodb.Table;
  userPool: cognito.UserPool;
  userPoolClient: cognito.UserPoolClient;
};

export const createLambdas = (stack: Stack, props: Props) => {
  const { whiteboardTable, connectionsTable, userPool, userPoolClient, stage } =
    props;

  const lambdaConfig: CreateLambdaProps[] = [
    {
      name: "createWhiteboard",
      stage,
      resources: [
        {
          grant: (fn) => whiteboardTable.grantWriteData(fn),
          envName: "whiteboardTable",
          envValue: whiteboardTable.tableName,
        },
      ],
    },
    {
      name: "getWhiteboardsList",
      stage,
      resources: [
        {
          grant: (fn) => whiteboardTable.grantReadData(fn),
          envName: "whiteboardTable",
          envValue: whiteboardTable.tableName,
        },
      ],
    },
    {
      name: "getWhiteboardItem",
      stage,
      resources: [
        {
          grant: (fn) => whiteboardTable.grantReadData(fn),
          envName: "whiteboardTable",
          envValue: whiteboardTable.tableName,
        },
      ],
    },
    {
      name: "updateWhiteboardData",
      grantWsAccess: true,
      stage,
      resources: [
        {
          grant: (fn) => whiteboardTable.grantReadWriteData(fn),
          envName: "whiteboardTable",
          envValue: whiteboardTable.tableName,
        },
      ],
    },
    {
      name: "connectWS",
      stage,
      resources: [
        {
          grant: (fn) => connectionsTable.grantWriteData(fn),
          envName: "connectionsDB",
          envValue: connectionsTable.tableName,
        },
      ],
    },
    {
      name: "disconnectWS",
      stage,
      resources: [
        {
          grant: (fn) => connectionsTable.grantWriteData(fn),
          envName: "connectionsDB",
          envValue: connectionsTable.tableName,
        },
      ],
    },
    {
      name: "authorizer",
      stage,
      env: {
        USER_POOL_ID: userPool.userPoolId,
        CLIENT_ID: userPoolClient.userPoolClientId,
      },
    },
  ];

  const lambdas = Object.fromEntries(
    lambdaConfig.map((config) => [
      config.name,
      new CreateLambda(stack, config),
    ]),
  );

  return lambdas;
};
