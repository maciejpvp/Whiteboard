import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { WhiteboardElement } from "../../types";
import { docClient } from "../../lambdas/utils/dynamoClient";

const whiteboardTable = process.env.whiteboardTable!;

type Props = {
  requesterId: string; // user wykonujący request
  ownerId: string; // właściciel tablicy
  id: string;
  newObject: WhiteboardElement;
};

export const updateWhiteboardData = async ({
  requesterId,
  ownerId,
  id,
  newObject,
}: Props) => {
  const command = new UpdateCommand({
    TableName: whiteboardTable,
    Key: { UserId: ownerId, WhiteboardId: id },

    // allow update if requester is owner OR requester has { userId, access: "write" }
    ConditionExpression:
      "UserId = :requester OR contains(#shareTo, :writeAccessObj)",

    UpdateExpression:
      "SET #data = list_append(if_not_exists(#data, :empty), :newObj), #updatedAt = :now",

    ExpressionAttributeNames: {
      "#data": "data",
      "#shareTo": "shareTo",
      "#updatedAt": "updatedAt",
    },

    ExpressionAttributeValues: {
      ":requester": ownerId, // owner always allowed
      ":writeAccessObj": { userId: requesterId, access: "write" },
      ":newObj": [newObject],
      ":empty": [],
      ":now": new Date().toISOString(),
    },
  });

  try {
    await docClient.send(command);
    return { success: true };
  } catch (err: any) {
    if (err.name === "ConditionalCheckFailedException") {
      return { success: false, error: "FORBIDDEN" };
    }
    console.log(err);
    return { success: false };
  }
};
