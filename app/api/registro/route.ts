import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  let authUserId: string | null = null;
  let perfilId: number | null = null;
  let eventoId: number | null = null;
  let registroCompleto = false;

  try {
    const body = await request.json();

    const nombre = String(body.nombre ?? "").trim();
    const correo = String(body.correo ?? "").trim().toLowerCase();
    const celular = String(body.celular ?? "").trim();
    const password = String(body.password ?? "");

    const nombreEvento = String(body.evento ?? "").trim();
    const tipoEvento = String(body.tipoEvento ?? "").trim();
    const fecha = String(body.fecha ?? "").trim();
    const estado = String(body.estado ?? "").trim();
    const ciudad = String(body.ciudad ?? "").trim();

    // Validar los datos e identificar exactamente qué campo falla.
    const errores: string[] = [];

    if (!nombre) errores.push("nombre");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      errores.push("correo");
    }

    if (!celular) errores.push("celular");
    if (password.length < 8) errores.push("contraseña");
    if (!nombreEvento) errores.push("nombre del evento");
    if (!tipoEvento) errores.push("tipo de evento");
    if (!fecha) errores.push("fecha");
    if (!estado) errores.push("estado");
    if (!ciudad) errores.push("ciudad");

    if (errores.length > 0) {
      console.error("Campos que fallan la validación:", errores);

      return NextResponse.json(
        {
          error: "Verifica los datos del registro.",
          campos: errores,
        },
        { status: 400 }
      );
    }

    if (body.promocion !== true) {
      return NextResponse.json(
        { error: "La promoción solicitada no es válida." },
        { status: 400 }
      );
    }

    // 1. Crear la cuenta de autenticación.
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: correo,
        password,
        email_confirm: true,
        user_metadata: { nombre, celular },
      });

    if (authError || !authData.user) {
      const mensajeError = authError?.message?.toLowerCase() ?? "";

      if (
        mensajeError.includes("already") ||
        mensajeError.includes("registered") ||
        mensajeError.includes("exists") ||
        mensajeError.includes("duplicate")
      ) {
        return NextResponse.json(
          {
            error:
              "Este correo ya tiene una cuenta. Inicia sesión para continuar.",
            codigo: "CUENTA_EXISTENTE",
          },
          { status: 409 }
        );
      }

      console.error("Error al crear usuario:", authError);

      return NextResponse.json(
        {
          error: "No fue posible crear la cuenta. Intenta nuevamente.",
        },
        { status: 400 }
      );
    }

    authUserId = authData.user.id;

    // 2. Crear el perfil.
    const { data: perfilNuevo, error: perfilError } =
      await supabaseAdmin
        .from("usuarios")
        .insert({
          auth_user_id: authUserId,
          nombre,
          correo,
          celular,
          password: null,
        })
        .select("id")
        .single();

    if (perfilError || !perfilNuevo) {
      console.error("Error al crear perfil:", perfilError);
      throw new Error("No fue posible crear el perfil de usuario.");
    }

    perfilId = perfilNuevo.id;

    // 3. Crear el evento promocional.
    const { data: eventoNuevo, error: eventoError } =
      await supabaseAdmin
        .from("eventos")
        .insert({
          usuario_id: perfilId,
          nombre_evento: nombreEvento,
          tipo_evento: tipoEvento,
          fecha,
          estado,
          ciudad,
          estatus: "ACTIVO",
          promocion: true,
        })
        .select("id, codigo")
        .single();

    if (eventoError || !eventoNuevo) {
      console.error("Error al crear evento:", eventoError);
      throw new Error("No fue posible crear el evento promocional.");
    }

    eventoId = eventoNuevo.id;

    // 4. Iniciar sesión y preparar las cookies.
    const cookieStore = await cookies();

    const cookiesPendientes: Array<{
      name: string;
      value: string;
      options?: Record<string, unknown>;
    }> = [];

    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
              cookiesPendientes.push({ name, value, options });
            });
          },
        },
      }
    );

    const { data: loginData, error: loginError } =
      await supabaseAuth.auth.signInWithPassword({
        email: correo,
        password,
      });

    if (loginError || !loginData.user) {
      console.error("Error al iniciar sesión:", loginError);

      // La cuenta y el evento ya existen; no los eliminamos.
      registroCompleto = true;

      return NextResponse.json(
        {
          error:
            "Tu cuenta y tu evento fueron creados, pero no se pudo iniciar sesión automáticamente. Ve a Iniciar sesión para continuar.",
          codigo: "INICIO_SESION_MANUAL",
        },
        { status: 500 }
      );
    }

    registroCompleto = true;

    const response = NextResponse.json(
      {
        ok: true,
        mensaje:
          "Cuenta creada, evento activado e inicio de sesión completado.",
        evento: {
          id: eventoNuevo.id,
          codigo: eventoNuevo.codigo,
        },
      },
      { status: 201 }
    );

    for (const cookie of cookiesPendientes) {
      response.cookies.set(
        cookie.name,
        cookie.value,
        cookie.options as Parameters<typeof response.cookies.set>[2]
      );
    }

    return response;
  } catch (error) {
    console.error("Error en el proceso de registro:", error);

    // Revertir únicamente los registros creados por esta operación.
    if (authUserId && !registroCompleto) {
      if (eventoId !== null) {
        const { error: eliminarEventoError } = await supabaseAdmin
          .from("eventos")
          .delete()
          .eq("id", eventoId);

        if (eliminarEventoError) {
          console.error("Error al revertir evento:", eliminarEventoError);
        }
      }

      if (perfilId !== null) {
        const { error: eliminarPerfilError } = await supabaseAdmin
          .from("usuarios")
          .delete()
          .eq("id", perfilId);

        if (eliminarPerfilError) {
          console.error("Error al revertir perfil:", eliminarPerfilError);
        }
      }

      const { error: eliminarUsuarioError } =
        await supabaseAdmin.auth.admin.deleteUser(authUserId);

      if (eliminarUsuarioError) {
        console.error(
          "Error al revertir usuario de autenticación:",
          eliminarUsuarioError
        );
      }
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al crear la cuenta.",
      },
      { status: 500 }
    );
  }
}
