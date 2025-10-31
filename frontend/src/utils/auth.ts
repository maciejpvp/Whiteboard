import {
  CLIENT_ID,
  COGNITO_DOMAIN,
  LOGOUT_REDIRECT_URL,
  REDIRECT_URL,
} from "@/config/config";

export const getCognitoLoginUrl = (identityProvider: string) => {
  return (
    `${COGNITO_DOMAIN}/oauth2/authorize` +
    `?identity_provider=${identityProvider}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URL)}` +
    "&response_type=CODE" +
    `&client_id=${CLIENT_ID}` +
    "&scope=openid+profile+email"
  );
};

export const redirectToGoogleLogin = () => {
  window.location.href = getCognitoLoginUrl("Google");
};

export const exchangeCodeForToken = async (code: string): Promise<void> => {
  const tokenUrl = `${COGNITO_DOMAIN}/oauth2/token`;

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      code,
      redirect_uri: REDIRECT_URL,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange code for token");
  }

  const data = await response.json();

  if (data.refresh_token) {
    localStorage.setItem("refreshToken", data.refresh_token);
  }

  window.location.href = "/";
};

export const refreshSession = async (
  refreshToken: string,
): Promise<string | null> => {
  const tokenUrl = `${COGNITO_DOMAIN}/oauth2/token`;

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: CLIENT_ID,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  if (data.id_token) {
    return data.id_token;
  }

  return null;
};

export const logout = () => {
  localStorage.removeItem("refreshToken");

  const logoutUrl =
    `${COGNITO_DOMAIN}/logout` +
    `?client_id=${CLIENT_ID}` +
    `&logout_uri=${encodeURIComponent(LOGOUT_REDIRECT_URL)}`;

  window.location.href = logoutUrl;
};
