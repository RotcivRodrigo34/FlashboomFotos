
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const LIMITE_FOTOS = 100;
const LIMITE_INICIAL = 6;

export async function GET(request: NextRequest) {
  try {
    const codigoEvento =
      request.nextUrl.searchParams.get("codigo");

    const todas =
      request.nextUrl.searchParams.get("todas") === "true";

    if (
      !codigoEvento ||
      !/^[A-Z0-9]{12}$/.test(codigoEvento)
    ) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "El código del evento no es válido.",
        },
        { status: 400 }
      );
    }

    const { data: evento, error: errorEvento } =
      await supabaseAdmin
        .from("eventos")
        .select("id")
        .eq("codigo", codigoEvento)
        .maybeSingle();

    if (errorEvento) {
      console.error(
        "Error al consultar el evento:",
        errorEvento.message
      );

      return NextResponse.json(
        {
          ok: false,
          mensaje: "No fue posible consultar el álbum.",
        },
        { status: 500 }
      );
    }

    if (!evento) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "Evento no encontrado.",
        },
        { status: 404 }
      );
    }

    const { count, error: errorConteo } =
      await supabaseAdmin
        .from("fotos_evento")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("evento_id", evento.id)
        .eq("estado", "ACTIVO")
        .not("google_file_id", "is", null);

    if (errorConteo) {
      console.error(
        "Error al contar las fotografías:",
        errorConteo.message
      );

      return NextResponse.json(
        {
          ok: false,
          mensaje: "No fue posible consultar las fotografías.",
        },
        { status: 500 }
      );
    }

    let query = supabaseAdmin
      .from("fotos_evento")
      .select(
        "id, evento_id, google_file_id, google_url, nombre_archivo, peso, ancho, alto, mime_type, estado, favorito, created_at, thumbnail_url"
      )
      .eq("evento_id", evento.id)
      .eq("estado", "ACTIVO")
      .not("google_file_id", "is", null)
      .order("id", { ascending: false });

    if (todas) {
      query = query.limit(LIMITE_FOTOS);
    } else {
      query = query.limit(LIMITE_INICIAL);
    }

    const { data: fotos, error: errorFotos } = await query;

    if (errorFotos) {
      console.error(
        "Error al consultar las fotografías:",
        errorFotos.message
      );

      return NextResponse.json(
        {
          ok: false,
          mensaje: "No fue posible cargar las fotografías.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      fotos: fotos ?? [],
      totalFotos: count ?? 0,
    });
  } catch (error) {
    console.error(
      "Error inesperado al consultar el álbum:",
      error instanceof Error ? error.message : "Error desconocido"
    );

    return NextResponse.json(
      {
        ok: false,
        mensaje: "Ocurrió un error al cargar el álbum.",
      },
      { status: 500 }
    );
  }
}
