import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { sendResponse } from "../utils/sendResponse";
import { getCognitoUser } from "../utils/getCognitoUser";
import { parsePathParams } from "../utils/parsePathParams";
import Joi from "joi";
import { getWhiteboardItem } from "../../services/whiteboard/getWhiteboardItem";

type PathParamsType = {
  id: string;
};

const pathParamsSchema = Joi.object<PathParamsType>({
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

    const item = await getWhiteboardItem({ userId, id });

    return sendResponse(200, {
      message: "Successfully got whiteboard item.",
      data: {
        item,
      },
    });
  } catch (err) {
    console.log(err);
    return sendResponse(500, {
      message: "Something went wrong",
    });
  }
};
