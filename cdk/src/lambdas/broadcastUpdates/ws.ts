import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../utils/dynamoClient";

const apiGwClient = new ApiGatewayManagementApiClient({
  endpoint: process.env.WS_ENDPOINT,
});

const tableName = process.env.connectionsDB!;

export const getConnectionIdsByUserId = async ({
  userId,
}: {
  userId: string;
}) => {
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: "userId = :uid",
    ExpressionAttributeValues: {
      ":uid": userId,
    },
  });

  const response = await docClient.send(command);

  const items = response.Items ?? [];

  const connectionIds = items.map((item) => {
    return item.connectionId;
  });

  return connectionIds;
};

type wsSendMessageProps = {
  userId: string;
  data: string;
};

export const wsSendMessage = async ({ userId, data }: wsSendMessageProps) => {
  const connectionIds = await getConnectionIdsByUserId({ userId });

  await Promise.all(
    connectionIds.map(async (connectionId) => {
      try {
        await apiGwClient.send(
          new PostToConnectionCommand({
            ConnectionId: connectionId,
            Data: Buffer.from(data),
          }),
        );
        console.log(`✅ Sent message to ${connectionId}`);
      } catch (err: any) {
        if (err.statusCode === 410) {
          console.log(`⚠️ Connection ${connectionId} is gone (stale).`);
          // Tutaj możesz usunąć connectionId z DynamoDB
        } else {
          console.error(`❌ Failed to send message to ${connectionId}:`, err);
        }
      }
    }),
  );
};
