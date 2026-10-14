import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    // 1. Validar la sesión actual de Supabase.
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Tu sesión ha expirado. Inicia sesión nuevamente." },
        { status: 401 }
      );
    }

    // 2. Obtener el perfil del usuario autenticado.
    const { data: perfil, error: perfilError } = await supabaseAdmin
      .from("usuarios")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (perfilError) {
      console.error("Error al consultar el perfil:", perfilError);

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

    // 3. Validar los datos del nuevo evento.
    const body = await request.json();

    const nombreEvento = String(body.evento ?? "").trim();
    const tipoEvento = String(body.tipoEvento ?? "").trim();
    const fecha = String(body.fecha ?? "").trim();
    const estado = String(body.estado ?? "").trim();
    const ciudad = String(body.ciudad ?? "").trim();

    if (
      !nombreEvento ||
      !tipoEvento ||
      !fecha ||
      !estado ||
      !ciudad
    ) {
      return NextResponse.json(
        { error: "Completa todos los datos del evento." },
        { status: 400 }
      );
    }

    // 4. Crear el evento vinculado al perfil autenticado.
    const { data: eventoNuevo, error: eventoError } =
      await supabaseAdmin
        .from("eventos")
        .insert({
          usuario_id: perfil.id,
          nombre_evento: nombreEvento,
          tipo_evento: tipoEvento,
          fecha,
          estado,
          ciudad,
          estatus: "ACTIVO",
          promocion: true,
        })
        .select("id, codigo, nombre_evento, fecha, ciudad")
        .single();

    if (eventoError || !eventoNuevo) {
      console.error("Error al crear el nuevo evento:", eventoError);

      return NextResponse.json(
        { error: "No fue posible crear el evento. Intenta nuevamente." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        mensaje: "Nuevo evento creado correctamente.",
        evento: eventoNuevo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en la API de creación de eventos:", error);

    return NextResponse.json(
      { error: "Ocurrió un error al crear el evento." },
      { status: 500 }
    );
  }
}
