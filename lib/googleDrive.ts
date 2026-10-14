
import { google } from "googleapis";
import { oauth2Client } from "./google";

export function obtenerDrive(accessToken?: string) {
  const clienteOAuth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
  );

  if (accessToken) {
    clienteOAuth.setCredentials({
      access_token: accessToken,
    });
  } else {
    clienteOAuth.setCredentials(oauth2Client.credentials);
  }

  return google.drive({
    version: "v3",
    auth: clienteOAuth,
  });
}

export async function buscarOCrearCarpetaFlashboom(
  accessToken?: string
) {
  const drive = obtenerDrive(accessToken);

  const buscar = await drive.files.list({
    q: "mimeType='application/vnd.google-apps.folder' and name='FlashboomFotos' and trashed=false",
    fields: "files(id,name)",
    spaces: "drive",
  });

  if (buscar.data.files && buscar.data.files.length > 0) {
    return buscar.data.files[0];
  }

  const carpeta = await drive.files.create({
    requestBody: {
      name: "FlashboomFotos",
      mimeType: "application/vnd.google-apps.folder",
    },
    fields: "id,name",
  });

  return carpeta.data;
}
