import { supabase } from "./supabase";
import {
  obtenerTokens,
  obtenerUsuario
} from "./googleOAuth";
import {
  buscarOCrearCarpetaFlashboom
} from "./googleDrive";

export async function conectarGoogleDrive(

  usuarioID:number,

  code:string

){

  const tokens=await obtenerTokens(code);

  const usuario=await obtenerUsuario();

  const carpeta=await buscarOCrearCarpetaFlashboom();

  const registro={

    usuario_id:usuarioID,

    google_email:usuario.email,

    access_token:tokens.access_token,

    refresh_token:tokens.refresh_token,

    drive_folder_root_id:carpeta.id,

    drive_folder_root_nombre:carpeta.name,

    token_expira:new Date(

      tokens.expiry_date ?? Date.now()

    ).toISOString(),

    conectado:true,

    estado:"conectado",

    ultima_sincronizacion:new Date().toISOString(),

    updated_at:new Date().toISOString()

  };

  const {data:existe}=await supabase

    .from("google_drive")

    .select("id")

    .eq("usuario_id",usuarioID)

    .maybeSingle();

  if(existe){

    return await supabase

      .from("google_drive")

      .update(registro)

      .eq("usuario_id",usuarioID)

      .select();

  }

  return await supabase

    .from("google_drive")

    .insert(registro)

    .select();

}