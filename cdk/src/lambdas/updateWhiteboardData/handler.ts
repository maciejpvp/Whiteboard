import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { sendResponse } from "../utils/sendResponse";
import { validateData } from "./validateData";
import { updateWhiteboardData } from "../../services/whiteboard/updateWhiteboardData";

import { SQS } from "aws-sdk";

const sqs = new SQS();

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    // Validates event data and extract necessary data for next step.
    const response = validateData(event);

    if (!response.ok) {
      return sendResponse(400, {
        message: response.message,
      });
    }

    // Push newObject into data attribute
    const { success } = await updateWhiteboardData(response);

    await sqs
      .sendMessage({
        QueueUrl: process.env.BROADCAST_QUEUE_URL!,
        MessageBody: JSON.stringify({
          userId: response.userId,
          type: "WHITEBOARD_DATA_UPDATE",
          payload: {
            whiteboardId: response.id,
            newObject: response.newObject,
          },
        }),
      })
      .promise();

    if (success) {
      return sendResponse(200, {
        message: "Successfully updated data",
      });
    } else {
      return sendResponse(500, {
        message: "Something went wrong",
      });
    }
  } catch (err) {
    console.log("ERROR: ", err);
    return sendResponse(500, {
      message: "Something went wrong.",
    });
  }
};
