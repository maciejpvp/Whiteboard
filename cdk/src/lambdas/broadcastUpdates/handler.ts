import { SQSHandler } from "aws-lambda";
import { wsSendMessage } from "./ws";
import { getUserIds } from "./getUserIds";

export const handler: SQSHandler = async (event) => {
  await Promise.all(
    event.Records.map(async (record) => {
      try {
        const { ownerId, whiteboardId, type, payload } = JSON.parse(
          record.body,
        );

        const ids = await getUserIds({ whiteboardId, ownerId });

        const sendPromise = ids.map((userId) =>
          wsSendMessage({
            userId,
            data: JSON.stringify({ type, payload }),
          }),
        );

        await Promise.all(sendPromise);
      } catch (err) {
        console.error(`❌ Failed to process record ${record.messageId}:`, err);
      }
    }),
  );
};
