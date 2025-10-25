import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../../lambdas/utils/dynamoClient";
import { WhiteboardItemType } from "../../types";

const whiteboardTable = process.env.whiteboardTable;

type Props = {
  userId: string;
};

export const getWhiteboardsList = async ({ userId }: Props) => {
  const command = new QueryCommand({
    TableName: whiteboardTable,
    KeyConditionExpression: "UserId = :uid",
    ExpressionAttributeValues: {
      ":uid": userId,
    },
    ProjectionExpression: "WhiteboardId, Title",
  });

  const response = await docClient.send(command);

  const items = (response.Items as WhiteboardItemType[]) || [];

  return items;
};
