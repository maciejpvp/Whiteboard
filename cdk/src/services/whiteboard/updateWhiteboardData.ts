import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { WhiteboardElement } from "../../types";
import { docClient } from "../../lambdas/utils/dynamoClient";

const whiteboardTable = process.env.whiteboardTable;

type Props = {
  userId: string;
  id: string;
  newObject: WhiteboardElement;
};

export const updateWhiteboardData = async ({
  userId,
  id,
  newObject,
}: Props) => {
  const command = new UpdateCommand({
    TableName: whiteboardTable,
    Key: { UserId: userId, WhiteboardId: id },
    UpdateExpression:
      "SET #data = list_append(if_not_exists(#data, :empty_list), :newObject)",
    ExpressionAttributeNames: {
      "#data": "data",
    },
    ExpressionAttributeValues: {
      ":newObject": [newObject],
      ":empty_list": [],
    },
    ReturnValues: "NONE",
  });

  try {
    await docClient.send(command);
    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false };
  }
};
