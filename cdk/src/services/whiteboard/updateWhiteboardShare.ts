import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../../lambdas/utils/dynamoClient";

const whiteboardTable = process.env.whiteboardTable!;
const sharedFilesTable = process.env.sharedFilesTable!;

type Props = {
  userId: string;
  id: string;
  email: string;
  access: "read" | "write";
};

type Response = {
  success: boolean;
};

export const updateWhiteboardShare = async ({
  userId,
  id,
  email,
  access,
}: Props): Promise<Response> => {
  const shareToItem = { email, access };

  const command = new TransactWriteCommand({
    TransactItems: [
      {
        Update: {
          TableName: whiteboardTable,
          Key: { UserId: userId, WhiteboardId: id },
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
          TableName: sharedFilesTable,
          Item: {
            Email: email,
            WhiteboardId: id,
            OwnerId: userId,
            Access: access,
          },
          ConditionExpression:
            "attribute_not_exists(Email) AND attribute_not_exists(WhiteboardId)",
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
