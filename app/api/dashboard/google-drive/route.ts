
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    // Validar la sesión del usuario
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "No has iniciado sesión." },
        { status: 401 }
      );
    }

    // Obtener el perfil vinculado a la cuenta autenticada
    const { data: perfil, error: perfilError } = await supabaseAdmin
      .from("usuarios")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (perfilError) {
      console.error("Error al consultar el perfil:", perfilError.message);

      return NextResponse.json(
        { error: "No fue posible validar tu perfil." },
        { status: 500 }
      );
    }

    if (!perfil) {
      return NextResponse.json(
        { error: "No se encontró tu perfil de usuario." },
        { status: 403 }
      );
    }

    // Consultar únicamente la conexión de Google Drive de ese perfil
    const { data, error } = await supabaseAdmin
      .from("google_drive")
      .select(
        `
          google_email,
          drive_folder_root_id,
          drive_folder_root_nombre,
          drive_total_storage,
          drive_used_storage,
          ultima_sincronizacion,
          conectado
        `
      )
      .eq("usuario_id", perfil.id)
      .maybeSingle();

    if (error) {
      console.error("Error al consultar Google Drive:", error.message);

      return NextResponse.json(
        { error: "No fue posible consultar Google Drive." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({
        conectado: false,
        google_email: "",
        drive_folder_root_id: "",
        drive_folder_root_nombre: "",
        drive_total_storage: null,
        drive_used_storage: null,
        ultima_sincronizacion: null,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en API de Google Drive:", error);

    return NextResponse.json(
      { error: "Ocurrió un error interno." },
      { status: 500 }
    );
  }
}
