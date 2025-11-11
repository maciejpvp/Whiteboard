import { BatchGetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../../lambdas/utils/dynamoClient";

const whiteboardTable = process.env.whiteboardTable!;
const whiteboardAccessTable = process.env.whiteboardAccessTable!;

type Props = {
  userId: string;
};

export const getSharedWhiteboardsList = async ({ userId }: Props) => {
  const accessCommand = new QueryCommand({
    TableName: whiteboardAccessTable,
    KeyConditionExpression: "UserId = :uid",
    ExpressionAttributeValues: {
      ":uid": userId,
    },
  });

  const accessResponse = await docClient.send(accessCommand);

  console.log(accessResponse);

  const accessItems = accessResponse.Items || [];

  if (accessItems.length === 0) return [];

  const keys = accessItems.map((item) => ({
    UserId: String(item.OwnerId),
    WhiteboardId: String(item.WhiteboardId),
  }));

  const batch = new BatchGetCommand({
    RequestItems: {
      [whiteboardTable]: {
        Keys: keys,
        ProjectionExpression: "#wid, #title, #uid, #updatedAt",
        ExpressionAttributeNames: {
          "#wid": "WhiteboardId",
          "#title": "Title",
          "#uid": "UserId",
          "#updatedAt": "updatedAt",
        },
      },
    },
  });

  const batchResponse = await docClient.send(batch);

  console.log(batchResponse);

  const sharedBoards = batchResponse.Responses?.[whiteboardTable] ?? [];

  const sharedWithMeta = sharedBoards.map((board) => {
    const access = accessItems.find(
      (a) =>
        a.WhiteboardId === board.WhiteboardId && a.OwnerId === board.UserId,
    );

    return {
      WhiteboardId: board.WhiteboardId,
      Title: board.Title,
      updatedAt: board.updatedAt,
      shared: true,
      accessLevel: access?.AccessLevel,
      owner: board.UserId,
    };
  });

  return sharedWithMeta;
};
