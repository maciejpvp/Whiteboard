import { SQSHandler } from "aws-lambda";
import { wsSendMessage } from "./ws";

export const handler: SQSHandler = async (event) => {
  await Promise.all(
    event.Records.map(async (record) => {
      try {
        const { userId, type, payload } = JSON.parse(record.body);

        console.log(`Send to ${userId}`);
        await wsSendMessage({
          userId,
          data: JSON.stringify({ type, payload }),
        });
      } catch (err) {
        console.error(`❌ Failed to process record ${record.messageId}:`, err);
      }
    }),
  );
};
