import { APIGatewayProxyEvent } from "aws-lambda";

export interface CognitoUser {
  userId: string;
  email?: string;
  username?: string;
  groups?: string[];
}

export function getCognitoUser(event: APIGatewayProxyEvent): CognitoUser {
  const claims =
    (event.requestContext.authorizer as any)?.jwt?.claims || // v2
    (event.requestContext.authorizer as any)?.claims; // v1

  if (!claims) {
    throw new Error("No Cognito user claims found in the request");
  }

  return {
    userId: claims.sub,
    email: claims.email,
    username: claims["cognito:username"],
    groups: claims["cognito:groups"] ? claims["cognito:groups"].split(",") : [],
  };
}
