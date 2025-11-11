import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { QueryCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
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

  return items.map((item) => item.connectionId);
};

type wsSendMessageProps = {
  userId: string;
  data: string;
};

export const wsSendMessage = async ({ userId, data }: wsSendMessageProps) => {
  const connectionIds = await getConnectionIdsByUserId({ userId });
  const staleConnections: { userId: string; connectionId: string }[] = [];

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
        if (err.$metadata?.httpStatusCode === 410) {
          console.log(`⚠️ Connection ${connectionId} is gone (stale).`);
          staleConnections.push({ userId, connectionId });
        } else {
          console.error(`❌ Failed to send message to ${connectionId}:`, err);
        }
      }
    }),
  );

  if (staleConnections.length > 0) {
    const deleteRequests = staleConnections.map((conn) => ({
      DeleteRequest: {
        Key: { userId: conn.userId, connectionId: conn.connectionId },
      },
    }));

    for (let i = 0; i < deleteRequests.length; i += 25) {
      const batch = deleteRequests.slice(i, i + 25);
      await docClient.send(
        new BatchWriteCommand({
          RequestItems: {
            [tableName]: batch,
          },
        }),
      );
    }

    console.log(
      `Deleted ${staleConnections.length} stale connections for user ${userId}`,
    );
  }
};
