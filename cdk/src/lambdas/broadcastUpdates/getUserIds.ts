import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../utils/dynamoClient";
import { WhiteboardItemType } from "../../types";

const whiteboardTable = process.env.whiteboardTable;

type Props = {
  whiteboardId: string;
  ownerId: string;
};

export const getUserIds = async ({ whiteboardId, ownerId }: Props) => {
  const command = new GetCommand({
    TableName: whiteboardTable,
    Key: { UserId: ownerId, WhiteboardId: whiteboardId },
  });

  const response = await docClient.send(command);

  const item = response.Item as WhiteboardItemType;

  if (!item) return [ownerId];

  const ids = (item.shareTo ?? []).map((u) => u.userId);

  return [ownerId, ...ids];
};
