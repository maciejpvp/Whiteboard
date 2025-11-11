import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({});
const userPoolId = process.env.userPoolId!;

export async function getUserIdFromEmail(
  email: string,
): Promise<string | null> {
  const command = new ListUsersCommand({
    UserPoolId: userPoolId,
    Filter: `email = "${email}"`,
    Limit: 1,
  });

  const response = await client.send(command);
  const user = response.Users?.[0];

  if (!user) return null;

  const sub = user.Attributes?.find((attr) => attr.Name === "sub")?.Value;
  return sub ?? null;
}
