import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { sendResponse } from "../utils/sendResponse";
import { getCognitoUser } from "../utils/getCognitoUser";
import { getWhiteboardsList } from "../../services/whiteboard/getWhiteboardsList";
import { getSharedWhiteboardsList } from "../../services/whiteboard/getSharedWhiteboards";

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const { userId } = getCognitoUser(event);

  const items = await getWhiteboardsList({ userId });
  const sharedItems = await getSharedWhiteboardsList({ userId });

  return sendResponse(200, {
    message: "Successfully got whiteboards list.",
    data: {
      items,
      sharedItems,
    },
  });
};
