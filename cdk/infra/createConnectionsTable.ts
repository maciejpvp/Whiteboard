import { Stack, RemovalPolicy } from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

type Props = {
  stage: string;
};

export const createConnectionsTable = (stack: Stack, props: Props) => {
  const { stage } = props;

  const table = new dynamodb.Table(
    stack,
    `WhiteboardConnectionsTable-${stage}`,
    {
      tableName: `WhiteboardConnectionsTable-${stage}`,
      partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "connectionId", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    },
  );

  const cfnTable = table.node.defaultChild as dynamodb.CfnTable;
  cfnTable.timeToLiveSpecification = {
    attributeName: "ttl",
    enabled: true,
  };

  return table;
};
