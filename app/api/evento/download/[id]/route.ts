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

    if (!Number.isInteger(fotoId)) {

        return NextResponse.json(
            {
                ok: false,
                mensaje: "ID de fotografía no válido."
            },
            {
                status: 400
            }
        );

    }

    // Buscar la fotografía en Supabase

    const { data: foto, error: errorFoto } =
        await supabaseAdmin
            .from("fotos_evento")
            .select("*")
            .eq("id", fotoId)
            .eq("estado", "ACTIVO")
            .single();

    if (errorFoto || !foto) {

        return NextResponse.json(
            {
                ok: false,
                mensaje: "Fotografía no encontrada."
            },
            {
                status: 404
            }
        );

    }

    // Buscar el evento para obtener el usuario propietario de Google Drive

    const { data: evento, error: errorEvento } =
        await supabaseAdmin
            .from("eventos")
            .select("*")
            .eq("id", foto.evento_id)
            .single();

    if (errorEvento || !evento) {

        return NextResponse.json(
            {
                ok: false,
                mensaje: "Evento no encontrado."
            },
            {
                status: 404
            }
        );

    }

    // Obtener un Access Token válido

    const accessToken =
        await obtenerAccessTokenValido(
            evento.usuario_id
        );

    // Crear cliente de Google Drive

    const auth = new google.auth.OAuth2();

    auth.setCredentials({
        access_token: accessToken
    });

    const drive = google.drive({
        version: "v3",
        auth
    });

    // Descargar archivo original desde Google Drive

    const archivo =
        await drive.files.get(
            {
                fileId: foto.google_file_id,
                alt: "media"
            },
            {
                responseType: "arraybuffer"
            }
        );

    const buffer = Buffer.from(
        archivo.data as ArrayBuffer
    );

    const nombreArchivo =
        foto.nombre_archivo || "fotografia";

    return new NextResponse(
        new Uint8Array(buffer),
        {
            status: 200,
            headers: {
                "Content-Type":
                    foto.mime_type || "application/octet-stream",

                "Content-Disposition":
                    `attachment; filename*=UTF-8''${encodeURIComponent(nombreArchivo)}`,

                "Content-Length":
                    buffer.length.toString(),

                "Cache-Control":
                    "no-store"
            }
        }
    );

} catch (error) {

    console.error(
        "========== ERROR DESCARGA =========="
    );

    console.error(error);

    console.error(
        "===================================="
    );

    return NextResponse.json(
        {
            ok: false,
            mensaje:
                error instanceof Error
                    ? error.message
                    : "Error al descargar la fotografía."
        },
        {
            status: 500
        }
    );

}}