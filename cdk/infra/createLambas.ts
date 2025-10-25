import { aws_dynamodb, Stack } from "aws-cdk-lib";
import { CreateLambda, CreateLambdaProps } from "../constructs/CreateLambda";

type Props = {
  whiteboardTable: aws_dynamodb.Table;
  stage: string;
};

export const createLambdas = (stack: Stack, props: Props) => {
  const { whiteboardTable, stage } = props;

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
  ];

  const lambdas = Object.fromEntries(
    lambdaConfig.map((config) => [
      config.name,
      new CreateLambda(stack, config),
    ]),
  );

  return lambdas;
};
