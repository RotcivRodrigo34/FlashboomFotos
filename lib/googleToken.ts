import { google } from "googleapis";
import { supabaseAdmin } from "./supabaseAdmin";

export async function obtenerAccessTokenValido(
  usuarioID: number
) {

  const { data, error } = await supabaseAdmin
    .from("google_drive")
    .select("*")
    .eq("usuario_id", usuarioID)
    .single();

  if (error || !data) {

    throw new Error("Google Drive no está conectado.");

  }

  const ahora = Date.now();

  const expira = new Date(
    data.token_expira
  ).getTime();

  // Si todavía es válido...

  if (expira > ahora + 60000) {

    return data.access_token;

  }

  // Renovar token

  const oauth2Client = new google.auth.OAuth2(

    process.env.GOOGLE_CLIENT_ID!,

    process.env.GOOGLE_CLIENT_SECRET!,

    process.env.NEXT_PUBLIC_APP_URL +
      "/api/auth/google/callback"

  );

  oauth2Client.setCredentials({

    refresh_token: data.refresh_token

  });

  const respuesta = await oauth2Client.refreshAccessToken();

  const tokens = respuesta.credentials;

  await supabaseAdmin

    .from("google_drive")

    .update({

      access_token: tokens.access_token,

      token_expira: new Date(

        tokens.expiry_date!

      ).toISOString(),

      updated_at: new Date().toISOString()

    })

    .eq("usuario_id", usuarioID);

  return tokens.access_token!;

}