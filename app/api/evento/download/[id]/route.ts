
import { NextResponse } from "next/server";
import { google } from "googleapis";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { obtenerAccessTokenValido } from "@/lib/googleToken";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const fotoId = Number(id);

    if (
      !Number.isSafeInteger(fotoId) ||
      fotoId <= 0
    ) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "ID de fotografía no válido.",
        },
        { status: 400 }
      );
    }

    // Exigir el código del evento para comprobar
    // que la fotografía pertenece a ese álbum.
    const url = new URL(request.url);
    const codigoEvento = url.searchParams.get("codigo");

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

    // Buscar la fotografía activa.
    const { data: foto, error: errorFoto } =
      await supabaseAdmin
        .from("fotos_evento")
        .select(
          "id, evento_id, google_file_id, nombre_archivo, mime_type, estado"
        )
        .eq("id", fotoId)
        .eq("estado", "ACTIVO")
        .maybeSingle();

    if (errorFoto) {
      console.error(
        "Error al consultar la fotografía:",
        errorFoto.message
      );

      return NextResponse.json(
        {
          ok: false,
          mensaje: "No fue posible consultar la fotografía.",
        },
        { status: 500 }
      );
    }

    if (!foto || !foto.google_file_id) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "Fotografía no encontrada.",
        },
        { status: 404 }
      );
    }

    // Comprobar que la foto pertenece al evento del QR.
    const { data: evento, error: errorEvento } =
      await supabaseAdmin
        .from("eventos")
        .select("id, usuario_id")
        .eq("id", foto.evento_id)
        .eq("codigo", codigoEvento)
        .maybeSingle();

    if (errorEvento) {
      console.error(
        "Error al validar el evento:",
        errorEvento.message
      );

      return NextResponse.json(
        {
          ok: false,
          mensaje: "No fue posible validar el álbum.",
        },
        { status: 500 }
      );
    }

    if (!evento || !evento.usuario_id) {
      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "La fotografía no pertenece a este álbum.",
        },
        { status: 404 }
      );
    }

    // Obtener el token de Google Drive del organizador.
    const accessToken =
      await obtenerAccessTokenValido(evento.usuario_id);

    const auth = new google.auth.OAuth2();

    auth.setCredentials({
      access_token: accessToken,
    });

    const drive = google.drive({
      version: "v3",
      auth,
    });

    const archivo = await drive.files.get(
      {
        fileId: foto.google_file_id,
        alt: "media",
      },
      {
        responseType: "arraybuffer",
      }
    );

    const buffer = Buffer.from(
      archivo.data as ArrayBuffer
    );

    const nombreArchivo =
      (foto.nombre_archivo || "fotografia")
        .replace(/[\r\n"]/g, "_")
        .slice(0, 200);

    // No permitir que una fila de la base de datos
    // establezca un tipo de contenido arbitrario.
    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const contentType =
      foto.mime_type &&
      tiposPermitidos.includes(foto.mime_type)
        ? foto.mime_type
        : "application/octet-stream";

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition":
          `attachment; filename*=UTF-8''${encodeURIComponent(nombreArchivo)}`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error(
      "Error al descargar la fotografía:",
      error instanceof Error
        ? error.message
        : "Error desconocido"
    );

    return NextResponse.json(
      {
        ok: false,
        mensaje: "No fue posible descargar la fotografía.",
      },
      { status: 500 }
    );
  }
}
