import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { sendResponse } from "../utils/sendResponse";
import { validateData } from "./validateData";
import { updateWhiteboardData } from "../../services/whiteboard/updateWhiteboardData";

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // Validates event data and extract necessary data for next step.
  const response = validateData(event);

  if (!response.ok) {
    return sendResponse(400, {
      message: response.message,
    });
  }

  // Push newObject into data attribute
  const { success } = await updateWhiteboardData(response);

  if (success) {
    return sendResponse(200, {
      message: "Successfully updated data",
    });
  } else {
    return sendResponse(500, {
      message: "Something went wrong",
    });
  }
};
