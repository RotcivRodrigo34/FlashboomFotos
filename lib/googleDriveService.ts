
import { supabaseAdmin } from "./supabaseAdmin";
import {
  obtenerTokens,
  obtenerUsuarioConToken,
} from "./googleOAuth";
import {
  buscarOCrearCarpetaFlashboom,
} from "./googleDrive";

export async function conectarGoogleDrive(
  usuarioID: number,
  code: string
) {
  if (!Number.isSafeInteger(usuarioID) || usuarioID <= 0) {
    throw new Error("El usuario no es válido.");
  }

  if (!code || !code.trim()) {
    throw new Error("No se recibió el código de autorización de Google.");
  }

  // Intercambiar el código por los tokens de Google.
  const tokens = await obtenerTokens(code);

  if (!tokens.access_token) {
    throw new Error("Google no devolvió un token de acceso válido.");
  }

const usuario = await obtenerUsuarioConToken(
  tokens.access_token
);
const carpeta = await buscarOCrearCarpetaFlashboom(
  tokens.access_token
);

  if (!usuario.email || !carpeta.id) {
    throw new Error(
      "No fue posible validar la cuenta o la carpeta de Google Drive."
    );
  }

  // Consultar la conexión existente para conservar su refresh_token
  // cuando Google no proporciona uno nuevo.
  const { data: existente, error: errorConsulta } =
    await supabaseAdmin
      .from("google_drive")
      .select("id, refresh_token")
      .eq("usuario_id", usuarioID)
      .maybeSingle();

  if (errorConsulta) {
    console.error(
      "Error al consultar la conexión de Google Drive:",
      errorConsulta.message
    );
    throw new Error("No fue posible consultar la conexión de Google Drive.");
  }

  const refreshToken =
    tokens.refresh_token || existente?.refresh_token;

  if (!refreshToken) {
    throw new Error(
      "Google no proporcionó un token de actualización. " +
      "Vuelve a autorizar la aplicación con acceso sin conexión."
    );
  }

  const registro = {
    usuario_id: usuarioID,
    google_email: usuario.email,
    access_token: tokens.access_token,
    refresh_token: refreshToken,
    drive_folder_root_id: carpeta.id,
    drive_folder_root_nombre: carpeta.name,
    token_expira: new Date(
      tokens.expiry_date ?? Date.now() + 3600 * 1000
    ).toISOString(),
    conectado: true,
    estado: "conectado",
    ultima_sincronizacion: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (existente) {
    const { error } = await supabaseAdmin
      .from("google_drive")
      .update(registro)
      .eq("usuario_id", usuarioID);

    if (error) {
      console.error(
        "Error al actualizar la conexión de Google Drive:",
        error.message
      );
      throw new Error("No fue posible actualizar Google Drive.");
    }

    return { data: { usuario_id: usuarioID }, error: null };
  }

  const { error } = await supabaseAdmin
    .from("google_drive")
    .insert(registro);

  if (error) {
    console.error(
      "Error al guardar la conexión de Google Drive:",
      error.message
    );
    throw new Error("No fue posible guardar la conexión de Google Drive.");
  }

  return { data: { usuario_id: usuarioID }, error: null };
}
