import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { sendResponse } from "../utils/sendResponse";
import { validateData } from "./validateData";
import { shareWhiteboard } from "../../services/whiteboard/shareWhiteboard";

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const response = validateData(event);

  if (!response.ok) {
    return sendResponse(400, {
      message: response.message,
    });
  }

  const updateWhiteboardShareResponse = await shareWhiteboard({
    userId: response.email,
    id: response.id,
    access: response.access,
    ownerId: response.userId,
  });

  if (updateWhiteboardShareResponse.success) {
    return sendResponse(200, {
      message: "Successfully shared whiteboard.",
    });
  } else {
    return sendResponse(500, {
      message: "Something went wrong",
    });
  }
};
