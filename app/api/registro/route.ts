
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  let authUserId: string | null = null;

  try {
    const body = await request.json();

    const nombre = String(body.nombre ?? "").trim();
    const correo = String(body.correo ?? "").trim().toLowerCase();
    const celular = String(body.celular ?? "").trim();
    const password = String(body.password ?? "");

    if (
      !nombre ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) ||
      !celular ||
      password.length < 8
    ) {
      return NextResponse.json(
        {
          error:
            "Verifica tu nombre, correo, celular y contraseña. La contraseña debe tener al menos 8 caracteres.",
        },
        { status: 400 }
      );
    }

    // Crear la cuenta de autenticación
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: correo,
        password,
        email_confirm: true,
        user_metadata: { nombre, celular },
      });

    if (authError || !authData.user) {
      return NextResponse.json(
        {
          error: authError?.message ?? "No se pudo crear la cuenta.",
        },
        { status: 400 }
      );
    }

    authUserId = authData.user.id;

    // Crear el perfil asociado a la cuenta
    const { error: perfilError } = await supabaseAdmin
      .from("usuarios")
      .insert({
        auth_user_id: authUserId,
        nombre,
        correo,
        celular,
        password: null,
      });

    if (perfilError) {
      await supabaseAdmin.auth.admin.deleteUser(authUserId);
      authUserId = null;

      return NextResponse.json(
        { error: perfilError.message },
        { status: 500 }
      );
    }

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

    // Iniciar sesión con la cuenta recién creada
    const { data: loginData, error: loginError } =
      await supabaseAuth.auth.signInWithPassword({
        email: correo,
        password,
      });

    if (loginError || !loginData.user) {
      await supabaseAdmin
        .from("usuarios")
        .delete()
        .eq("auth_user_id", authUserId);

      await supabaseAdmin.auth.admin.deleteUser(authUserId);
      authUserId = null;

      return NextResponse.json(
        {
          error:
            "No fue posible iniciar sesión después del registro. Intenta nuevamente.",
        },
        { status: 500 }
      );
    }

    // Adjuntar las cookies a la respuesta HTTP
    const response = NextResponse.json(
      {
        ok: true,
        mensaje: "Cuenta creada e inicio de sesión completado.",
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
    console.error("Error en registro:", error);

    if (authUserId) {
      await supabaseAdmin
        .from("usuarios")
        .delete()
        .eq("auth_user_id", authUserId);

      await supabaseAdmin.auth.admin.deleteUser(authUserId);
    }

    return NextResponse.json(
      { error: "Ocurrió un error al crear la cuenta." },
      { status: 500 }
    );
  }
}
