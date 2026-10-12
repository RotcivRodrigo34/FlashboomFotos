
import { google } from "googleapis";
import { oauth2Client } from "./google";

export async function obtenerTokens(code: string) {
  if (!code || !code.trim()) {
    throw new Error("No se recibió el código de autorización de Google.");
  }

  // Mantener la misma configuración OAuth del proyecto.
  const clienteOAuth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
  );

  const { tokens } = await clienteOAuth.getToken(code);

  if (!tokens.access_token) {
    throw new Error("Google no devolvió un token de acceso.");
  }

  return tokens;
}

export async function obtenerUsuarioConToken(accessToken: string) {
  if (!accessToken) {
    throw new Error("No se recibió el token de acceso de Google.");
  }

  const clienteOAuth = new google.auth.OAuth2();

  clienteOAuth.setCredentials({
    access_token: accessToken,
  });

  const oauth2 = google.oauth2({
    version: "v2",
    auth: clienteOAuth,
  });

  const { data } = await oauth2.userinfo.get();

  if (!data.email) {
    throw new Error("Google no devolvió el correo de la cuenta.");
  }

  return data;
}
