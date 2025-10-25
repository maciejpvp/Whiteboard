import { BodyType } from "../../lambdas/createWhiteboard/createWhiteboard";
import { docClient } from "../../lambdas/utils/dynamoClient";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const whiteboardTable = process.env.whiteboardTable;

type Props = {
  body: BodyType;
  userId: string;
};

export const insertWhiteboard = async ({ body, userId }: Props) => {
  const { v4: uuidv4 } = await import("uuid");

  const item = {
    UserId: userId,
    WhiteboardId: uuidv4(),
    Title: body.name,
    data: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const command = new PutCommand({
    TableName: whiteboardTable,
    Item: item,
  });

  await docClient.send(command);

  return item;
};
