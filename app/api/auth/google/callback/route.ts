
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import { conectarGoogleDrive } from "@/lib/googleDriveService";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const estadoGuardado = cookieStore.get("google_oauth_state")?.value;
  const estadoRecibido = request.nextUrl.searchParams.get("state");
  const code = request.nextUrl.searchParams.get("code");
  const errorGoogle = request.nextUrl.searchParams.get("error");

  const respuestaError = (mensaje: string, status = 400) => {
    const response = NextResponse.json(
      { error: mensaje },
      { status }
    );

    response.cookies.delete("google_oauth_state");
    return response;
  };

  try {
    if (errorGoogle) {
      return NextResponse.redirect(
        new URL("/dashboard?drive=cancelado", request.url)
      );
    }

    if (
      !code ||
      !estadoRecibido ||
      !estadoGuardado ||
      estadoRecibido !== estadoGuardado
    ) {
      return respuestaError(
        "La autorización de Google no es válida o ha expirado."
      );
    }

    // Confirmar que la sesión sigue autenticada.
    const supabase = await createClient();

    const {
      data: { user },
      error: errorAuth,
    } = await supabase.auth.getUser();

    if (errorAuth || !user) {
      return respuestaError(
        "Tu sesión expiró. Inicia sesión nuevamente.",
        401
      );
    }

    // Obtener el perfil asociado exclusivamente a esa sesión.
    const { data: perfil, error: errorPerfil } =
      await supabase
        .from("usuarios")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

    if (errorPerfil || !perfil) {
      console.error(
        "No se pudo validar el perfil para Google Drive."
      );

      return respuestaError(
        "No se encontró el perfil del organizador.",
        403
      );
    }

    const resultado = await conectarGoogleDrive(
      perfil.id,
      code
    );

    if (resultado.error) {
      console.error(
        "No se pudo guardar la conexión de Google Drive."
      );

      return respuestaError(
        "No fue posible guardar la conexión de Google Drive.",
        500
      );
    }

    const response = NextResponse.redirect(
      new URL("/dashboard?drive=ok", request.url)
    );

    response.cookies.delete("google_oauth_state");

    return response;
  } catch (error) {
    console.error(
      "Error en la autorización de Google:",
      error instanceof Error ? error.message : "Error desconocido"
    );

    return respuestaError(
      "Ocurrió un error al conectar Google Drive.",
      500
    );
  }
}
