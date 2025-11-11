import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../../lambdas/utils/dynamoClient";
import { WhiteboardItemType } from "../../types";

const whiteboardTable = process.env.whiteboardTable;

type Props = {
  ownerId: string;
  id: string;
  userId: string;
};

export const getSharedWhiteboardItem = async ({
  ownerId,
  userId,
  id,
}: Props) => {
  const command = new GetCommand({
    TableName: whiteboardTable,
    Key: { UserId: ownerId, WhiteboardId: id },
  });

  const response = await docClient.send(command);

  const item = response.Item as WhiteboardItemType;

  if (!item.shareTo || item.shareTo.length === 0) return false;

  const hasAccess = item.shareTo.find((i) => i.userId === userId);

  if (!hasAccess) return false;

  return {
    item,
    access: hasAccess.access,
  };
};
