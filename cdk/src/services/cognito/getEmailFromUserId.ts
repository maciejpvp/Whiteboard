import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({});
const userPoolId = process.env.userPoolId!;

export async function getEmailFromUserId(
  userId: string,
): Promise<string | null> {
  const command = new ListUsersCommand({
    UserPoolId: userPoolId,
    Filter: `sub = "${userId}"`,
    Limit: 1,
  });

  const response = await client.send(command);
  const user = response.Users?.[0];
  if (!user) return null;

  const email = user.Attributes?.find((attr) => attr.Name === "email")?.Value;
  return email ?? null;
}
