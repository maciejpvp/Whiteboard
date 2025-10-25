import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { sendResponse } from "../utils/sendResponse";
import { getCognitoUser } from "../utils/getCognitoUser";
import { getWhiteboardsList } from "../../services/whiteboard/getWhiteboardsList";

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const { userId } = getCognitoUser(event);

  const items = getWhiteboardsList({ userId });

  return sendResponse(200, {
    message: "Successfully got whiteboards list.",
    data: {
      items,
    },
  });
};
