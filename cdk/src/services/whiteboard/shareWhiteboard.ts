import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../../lambdas/utils/dynamoClient";

const whiteboardTable = process.env.whiteboardTable!;
const whiteboardAccessTable = process.env.whiteboardAccessTable!;

type Props = {
  userId: string;
  id: string;
  access: "read" | "write";
  ownerId: string;
};

type Response = {
  success: boolean;
};

export const shareWhiteboard = async ({
  userId,
  id,
  access,
  ownerId,
}: Props): Promise<Response> => {
  const shareToItem = { userId, access };

  const command = new TransactWriteCommand({
    TransactItems: [
      {
        Update: {
          TableName: whiteboardTable,
          Key: { UserId: ownerId, WhiteboardId: id },
          UpdateExpression:
            "SET #shareTo = list_append(if_not_exists(#shareTo, :empty_list), :shareToItem)",
          ExpressionAttributeNames: {
            "#shareTo": "shareTo",
          },
          ExpressionAttributeValues: {
            ":shareToItem": [shareToItem],
            ":empty_list": [],
          },
        },
      },
      {
        Put: {
          TableName: whiteboardAccessTable,
          Item: {
            UserId: userId,
            WhiteboardId: id,
            Access: access,
            OwnerId: ownerId,
          },
          ConditionExpression:
            "attribute_not_exists(UserId) AND attribute_not_exists(WhiteboardId)",
        },
      },
    ],
  });

  try {
    await docClient.send(command);
    return { success: true };
  } catch (err) {
    console.error("Error:", err);
    return { success: false };
  }
};
