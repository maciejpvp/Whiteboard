import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../utils/dynamoClient";
import { sendResponse } from "../utils/sendResponse";

const tableName = process.env.connectionsDB!;

export const handler = async (event: any) => {
  try {
    const connectionId = event.requestContext.connectionId;
    const userId = event.requestContext.authorizer.sub;

    const command = new DeleteCommand({
      TableName: tableName,
      Key: {
        userId,
        connectionId,
      },
    });

    await docClient.send(command);

    return sendResponse(200, { message: "testing" });
  } catch (err) {
    console.log(err);

    return sendResponse(500, {
      message: "Something went wrong.",
    });
  }
};
