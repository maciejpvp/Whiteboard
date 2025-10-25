import { RemovalPolicy, Stack } from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

type Props = {
  stack: Stack;
  stage: string;
};

export const createWhiteboardTable = (props: Props) => {
  const { stack, stage } = props;

  const tableName = `WhiteboardTable-${stage}`;

  const table = new dynamodb.Table(stack, tableName, {
    tableName,
    partitionKey: { name: "UserId", type: dynamodb.AttributeType.STRING },
    sortKey: { name: "WhiteboardId", type: dynamodb.AttributeType.STRING },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    removalPolicy: RemovalPolicy.DESTROY,
  });

  return table;
};
