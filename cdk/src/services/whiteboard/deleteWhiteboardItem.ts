import {
  GetCommand,
  DeleteCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { docClient } from "../../lambdas/utils/dynamoClient";

const whiteboardTable = process.env.whiteboardTable!;
const whiteboardAccessTable = process.env.whiteboardAccessTable!;

type Props = {
  ownerId: string;
  id: string;
};

export const deleteWhiteboardItem = async ({ ownerId, id }: Props) => {
  const whiteboard = await docClient.send(
    new GetCommand({
      TableName: whiteboardTable,
      Key: { UserId: ownerId, WhiteboardId: id },
    }),
  );

  const shareTo = whiteboard.Item?.shareTo ?? [];

  if (shareTo.length > 0) {
    const deleteRequests = shareTo.map((entry: any) => ({
      DeleteRequest: {
        Key: {
          UserId: entry.userId,
          WhiteboardId: id,
        },
      },
    }));

    while (deleteRequests.length > 0) {
      const chunk = deleteRequests.splice(0, 25);
      await docClient.send(
        new BatchWriteCommand({
          RequestItems: {
            [whiteboardAccessTable]: chunk,
          },
        }),
      );
    }
  }

  await docClient.send(
    new DeleteCommand({
      TableName: whiteboardTable,
      Key: { UserId: ownerId, WhiteboardId: id },
    }),
  );

  return { success: true };
};
