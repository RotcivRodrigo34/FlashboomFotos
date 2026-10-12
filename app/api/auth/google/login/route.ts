
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";

import {
  oauth2Client,
  GOOGLE_SCOPES,
} from "@/lib/google";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    const { data: perfil, error: errorPerfil } =
      await supabase
        .from("usuarios")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

    if (errorPerfil || !perfil) {
      return NextResponse.json(
        { error: "No se encontró el perfil del organizador." },
        { status: 403 }
      );
    }

    // Estado aleatorio para vincular la respuesta de Google
    // con esta autorización y esta sesión.
    const state = randomUUID();

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: GOOGLE_SCOPES,
      state,
    });

    const cookieStore = await cookies();

    cookieStore.set("google_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60,
    });

    return NextResponse.redirect(url);
  } catch (error) {
    console.error(
      "Error al iniciar autorización de Google:",
      error instanceof Error ? error.message : "Error desconocido"
    );

    return NextResponse.json(
      { error: "No fue posible iniciar la conexión con Google." },
      { status: 500 }
    );
  }
}
