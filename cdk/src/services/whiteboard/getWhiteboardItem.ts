import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../../lambdas/utils/dynamoClient";
import { WhiteboardItemType } from "../../types";

const whiteboardTable = process.env.whiteboardTable;

type Props = {
  userId: string;
  id: string;
};

export const getWhiteboardItem = async ({ userId, id }: Props) => {
  const command = new GetCommand({
    TableName: whiteboardTable,
    Key: { UserId: userId, WhiteboardId: id },
  });

  const response = await docClient.send(command);

  const items = response.Item as WhiteboardItemType;

  return items;
};
