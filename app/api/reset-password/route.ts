
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const accion = body.accion;
    const token =
      typeof body.token === "string" ? body.token.trim() : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    if (!token || !["validar", "actualizar"].includes(accion)) {
      return NextResponse.json(
        { ok: false, mensaje: "La solicitud no es válida." },
        { status: 400 }
      );
    }

    if (
      accion === "actualizar" &&
      (password.length < 8 || password.length > 128)
    ) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "La contraseña debe tener entre 8 y 128 caracteres.",
        },
        { status: 400 }
      );
    }

    const { data: solicitudes, error: errorToken } =
      await supabaseAdmin
        .from("password_reset")
        .select("usuario_id, expira, usado")
        .eq("token", token)
        .limit(1);

    if (errorToken) {
      console.error("Error al consultar solicitud de recuperación.");

      return NextResponse.json(
        { ok: false, mensaje: "No fue posible validar el enlace." },
        { status: 500 }
      );
    }

    const solicitud = solicitudes?.[0];

    if (
      !solicitud ||
      solicitud.usado ||
      !solicitud.expira ||
      new Date(solicitud.expira).getTime() <= Date.now()
    ) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "El enlace es inválido, ya se utilizó o ha expirado.",
        },
        { status: 400 }
      );
    }

    if (accion === "validar") {
      return NextResponse.json({
        ok: true,
        mensaje: "Token válido.",
      });
    }

    // Obtener la cuenta de Supabase Auth vinculada al perfil.
    const { data: perfil, error: errorPerfil } =
      await supabaseAdmin
        .from("usuarios")
        .select("auth_user_id")
        .eq("id", solicitud.usuario_id)
        .maybeSingle();

    if (errorPerfil || !perfil?.auth_user_id) {
      console.error("No se encontró la cuenta Auth del usuario.");

      return NextResponse.json(
        {
          ok: false,
          mensaje: "No se encontró una cuenta válida para esta solicitud.",
        },
        { status: 400 }
      );
    }

    // Actualizar la contraseña de Supabase Auth.
    const { error: errorPassword } =
      await supabaseAdmin.auth.admin.updateUserById(
        perfil.auth_user_id,
        { password }
      );

    if (errorPassword) {
      console.error("Error al actualizar la contraseña de Auth.");

      return NextResponse.json(
        {
          ok: false,
          mensaje: "No fue posible actualizar la contraseña.",
        },
        { status: 500 }
      );
    }

    // Marcar el token como usado solo después de actualizar la contraseña.
    const { data: tokenActualizado, error: errorActualizarToken } =
      await supabaseAdmin
        .from("password_reset")
        .update({ usado: true })
        .eq("token", token)
        .eq("usado", false)
        .gt("expira", new Date().toISOString())
        .select("token");

    if (
      errorActualizarToken ||
      !tokenActualizado ||
      tokenActualizado.length === 0
    ) {
      console.error("No se pudo marcar el token como utilizado.");

      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "La contraseña se actualizó, pero no se pudo confirmar el uso del enlace. Solicita un nuevo enlace si es necesario.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      mensaje: "Contraseña actualizada correctamente.",
    });
  } catch (error) {
    console.error(
      "Error en la API de recuperación:",
      error instanceof Error ? error.message : "Error desconocido"
    );

    return NextResponse.json(
      {
        ok: false,
        mensaje: "Ocurrió un error al procesar la solicitud.",
      },
      { status: 500 }
    );
  }
}
