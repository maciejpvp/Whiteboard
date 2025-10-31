export const API_URL = import.meta.env.VITE_API_URL;
export const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
export const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;
export const LOGOUT_REDIRECT_URL = import.meta.env.VITE_LOGOUT_REDIRECT_URL;
export const WS_URL = import.meta.env.VITE_WS_URL;

if (!API_URL) {
  throw new Error(
    "VITE_API_URL is not defined! Make sure you have the correct .env file.",
  );
}
