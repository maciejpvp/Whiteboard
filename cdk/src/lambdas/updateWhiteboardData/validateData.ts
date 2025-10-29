import { WhiteboardElement } from "../../types";
import Joi from "joi";
import { whiteboardElementSchema } from "../../validators/whiteboardElementValidator";
import { parseBody } from "../utils/parseBody";
import { parsePathParams } from "../utils/parsePathParams";
import { APIGatewayProxyEvent } from "aws-lambda";
import { getCognitoUser } from "../utils/getCognitoUser";

type BodyType = {
  newObject: WhiteboardElement;
};

type PathParamsType = {
  id: string;
};

const pathParamsSchema = Joi.object<PathParamsType>({
  id: Joi.string().guid({ version: "uuidv4" }).required(),
});

const bodySchema = Joi.object<BodyType>({
  newObject: whiteboardElementSchema.required(),
});

type Response =
  | {
      ok: true;
      id: string;
      newObject: WhiteboardElement;
      userId: string;
    }
  | {
      ok: false;
      message: string;
    };

export const validateData = (event: APIGatewayProxyEvent): Response => {
  // Getting and validating body

  const bodyParseResult = parseBody<BodyType>({
    event,
    schema: bodySchema,
  });

  if (!bodyParseResult.ok) {
    return { ok: false, message: bodyParseResult.error };
  }

  const body = bodyParseResult.value;

  // Getting and validationg path params

  const pathParseResult = parsePathParams({
    event,
    schema: pathParamsSchema,
  });

  if (!pathParseResult.ok) {
    return { ok: false, message: pathParseResult.error };
  }

  const id = pathParseResult.value.id;

  const { userId } = getCognitoUser(event);

  return { ok: true, id, newObject: body.newObject, userId };
};
