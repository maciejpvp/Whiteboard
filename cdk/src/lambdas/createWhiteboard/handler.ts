import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { sendResponse } from "../utils/sendResponse";
import Joi from "joi";
import { parseBody } from "../utils/parseBody";
import { insertWhiteboard } from "../../services/whiteboard/insertWhiteboard";
import { getCognitoUser } from "../utils/getCognitoUser";

export type BodyType = {
  name: string;
};

const bodySchema = Joi.object<BodyType>({
  name: Joi.string().min(1).max(60).required(),
});

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const result = parseBody<BodyType>({
    event,
    schema: bodySchema,
  });

  if (!result.ok) {
    return sendResponse(400, {
      message: result.error,
    });
  }

  const { userId } = getCognitoUser(event);

  const body = result.value;

  const item = await insertWhiteboard({
    body,
    userId,
  });

  return sendResponse(200, {
    message: "Successfully created Whiteboard Project",
    data: {
      item,
    },
  });
};
