import { OAuth2Client } from "google-auth-library";

export function getGoogleClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectURI = process.env.GOOGLE_REDIRECTION_URI;

  if (!clientId || !clientSecret) throw new Error("Google client is missing.");

  return new OAuth2Client({
    client_id: clientId,
    client_secret: clientSecret,
    redirectUri: redirectURI,
  });
}
