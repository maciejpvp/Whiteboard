import { SQSHandler } from "aws-lambda";
import { wsSendMessage } from "./ws";

export const handler: SQSHandler = async (event) => {
  try {
    for (const record of event.Records) {
      const { userId, type, payload } = JSON.parse(record.body);

      console.log(`HERE ${userId}`);

      await wsSendMessage({
        userId,
        data: JSON.stringify({
          type,
          payload,
        }),
      });
    }
  } catch (err) {
    console.log(`ERROR OCCURE: ${err}`);
  }
};
