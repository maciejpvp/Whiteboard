import { CognitoJwtVerifier } from "aws-jwt-verify";
import {
  APIGatewayAuthorizerEvent,
  APIGatewayAuthorizerHandler,
  APIGatewayAuthorizerResult,
} from "aws-lambda";

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID!,
  clientId: process.env.CLIENT_ID!,
  tokenUse: "id",
});

export const handler: APIGatewayAuthorizerHandler = async (
  event: APIGatewayAuthorizerEvent,
): Promise<APIGatewayAuthorizerResult> => {
  const token = (event as any).queryStringParameters?.Authorization;

  const payload = await verifier.verify(token);

  console.log(payload);

  return {
    principalId: payload.sub,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: event.methodArn,
        },
      ],
    },
    context: { sub: payload.sub },
  };
};
