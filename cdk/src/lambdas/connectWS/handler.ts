import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../utils/dynamoClient";
import { sendResponse } from "../utils/sendResponse";

const tableName = process.env.connectionsDB!;

export const handler = async (event: any) => {
  console.log("CONNECT");
  try {
    const userId = event.requestContext.authorizer?.sub;
    const connectionId = event.requestContext.connectionId;

    console.log(userId, connectionId);

    const now = Math.floor(Date.now() / 1000);
    const ttl = now + 24 * 60 * 60; // 24h = 86400s

    const item = {
      userId,
      connectionId,
      ttl,
    };

    const command = new PutCommand({
      TableName: tableName,
      Item: item,
    });

    await docClient.send(command);

    return sendResponse(200, {
      message: "WS Connection Success!",
    });
  } catch (err) {
    console.log(err);

    return sendResponse(500, {
      message: "Something went wrong.",
    });
  }
};
