import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { sendResponse } from "../utils/sendResponse";
import { getCognitoUser } from "../utils/getCognitoUser";
import { parsePathParams } from "../utils/parsePathParams";
import Joi from "joi";
import { getSharedWhiteboardItem } from "../../services/whiteboard/getSharedWhiteboardItem";

type PathParamsType = {
  ownerId: string;
  id: string;
};

const pathParamsSchema = Joi.object<PathParamsType>({
  ownerId: Joi.string().uuid().required(),
  id: Joi.string().guid({ version: "uuidv4" }).required(),
});

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = getCognitoUser(event);
    const response = parsePathParams({
      event,
      schema: pathParamsSchema,
    });

    if (!response.ok) {
      return sendResponse(400, {
        message: response.error,
      });
    }

    const id = response.value.id;
    const ownerId = response.value.ownerId;

    const data = await getSharedWhiteboardItem({ userId, id, ownerId });

    if (data === false) {
      return sendResponse(404, {
        message: "Item not found",
      });
    }

    return sendResponse(200, {
      message: "Successfully got whiteboard item.",
      data,
    });
  } catch (err) {
    console.log(err);
    return sendResponse(500, {
      message: "Something went wrong",
    });
  }
};
