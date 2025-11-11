import { aws_dynamodb, Stack } from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";
import { CreateLambda, CreateLambdaProps } from "../constructs/CreateLambda";

type Props = {
  whiteboardTable: aws_dynamodb.Table;
  whiteboardAccessTable: aws_dynamodb.Table;
  stage: string;
  connectionsTable: aws_dynamodb.Table;
  userPool: cognito.UserPool;
  userPoolClient: cognito.UserPoolClient;
};

export const createLambdas = (stack: Stack, props: Props) => {
  const {
    whiteboardTable,
    whiteboardAccessTable,
    connectionsTable,
    userPool,
    userPoolClient,
    stage,
  } = props;

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
      name: "deleteWhiteboard",
      stage,
      resources: [
        {
          grant: (fn) => whiteboardTable.grantReadWriteData(fn),
          envName: "whiteboardTable",
          envValue: whiteboardTable.tableName,
        },
        {
          grant: (fn) => whiteboardAccessTable.grantReadWriteData(fn),
          envName: "whiteboardAccessTable",
          envValue: whiteboardAccessTable.tableName,
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
        {
          grant: (fn) => whiteboardAccessTable.grantReadWriteData(fn),
          envName: "whiteboardAccessTable",
          envValue: whiteboardAccessTable.tableName,
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
      name: "getSharedWhiteboard",
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
      name: "shareWhiteboard",
      stage,
      resources: [
        {
          grant: (fn) => whiteboardTable.grantReadWriteData(fn),
          envName: "whiteboardTable",
          envValue: whiteboardTable.tableName,
        },
        {
          grant: (fn) => whiteboardAccessTable.grantReadWriteData(fn),
          envName: "whiteboardAccessTable",
          envValue: whiteboardAccessTable.tableName,
        },
        {
          grant: (fn) => {
            fn.addToRolePolicy(
              new iam.PolicyStatement({
                actions: ["cognito-idp:ListUsers"],
                resources: [
                  `arn:aws:cognito-idp:${stack.region}:${stack.account}:userpool/${userPool.userPoolId}`,
                ],
              }),
            );
          },
          envName: "userPoolId",
          envValue: userPool.userPoolId,
        },
      ],
    },
    {
      name: "unshareWhiteboard",
      stage,
      resources: [
        {
          grant: (fn) => whiteboardTable.grantReadWriteData(fn),
          envName: "whiteboardTable",
          envValue: whiteboardTable.tableName,
        },
        {
          grant: (fn) => whiteboardAccessTable.grantReadWriteData(fn),
          envName: "whiteboardAccessTable",
          envValue: whiteboardAccessTable.tableName,
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
    {
      name: "broadcastUpdates",
      stage,
      grantWsAccess: true,
      timeoutSec: 10,
      resources: [
        {
          grant: (fn) => connectionsTable.grantReadWriteData(fn),
          envName: "connectionsDB",
          envValue: connectionsTable.tableName,
        },
      ],
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
