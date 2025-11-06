import { WhiteboardElement } from "../../types";
import Joi from "joi";
import { whiteboardElementSchema } from "../../validators/whiteboardElementValidator";
import { parseBody } from "../utils/parseBody";
import { parsePathParams } from "../utils/parsePathParams";
import { APIGatewayProxyEvent } from "aws-lambda";
import { getCognitoUser } from "../utils/getCognitoUser";

type BodyType = {
  email: string;
  access: "read" | "write";
};

type PathParamsType = {
  id: string;
};

const pathParamsSchema = Joi.object<PathParamsType>({
  id: Joi.string().trim().guid({ version: "uuidv4" }).required(),
})
  .unknown(false)
  .strict();

const bodySchema = Joi.object<BodyType>({
  email: Joi.string().trim().email().max(255).required(),
  access: Joi.string().valid("read", "write").required(),
})
  .unknown(true)
  .strict();

type Response =
  | {
      ok: true;
      userId: string;
      email: string;
      access: "read" | "write";
      id: string;
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

  return { ok: true, id, email: body.email, access: body.access, userId };
};
