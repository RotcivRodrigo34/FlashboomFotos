
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { obtenerAccessTokenValido } from "@/lib/googleToken";
import { subirMiniatura } from "@/lib/supabaseStorage";
import sharp from "sharp";

import {
  buscarOCrearCarpetaEvento,
  subirArchivoDrive,
  hacerArchivoPublico,
} from "@/lib/googleDriveUpload";

const MAX_FILE_SIZE = 15 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const archivo = formData.get("foto");
    const codigoEvento = formData.get("codigoEvento");

    // Validar el código del evento
    if (
      typeof codigoEvento !== "string" ||
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

    // Validar que se haya recibido un archivo
    if (
      !(archivo instanceof File) ||
      archivo.size === 0
    ) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "No se recibió ninguna fotografía válida.",
        },
        { status: 400 }
      );
    }

    // Validar tamaño y tipo declarado
    if (archivo.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "La fotografía no debe superar los 15 MB.",
        },
        { status: 413 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(archivo.type)) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "Solo se permiten imágenes JPG, PNG o WebP.",
        },
        { status: 415 }
      );
    }

    // Buscar el evento por su código
    const { data: evento, error: errorEvento } =
      await supabaseAdmin
        .from("eventos")
        .select(
          "id, usuario_id, nombre_evento, codigo, estatus"
        )
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
          mensaje: "No fue posible consultar el evento.",
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

    if (!evento.usuario_id) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "El evento no tiene un organizador asignado.",
        },
        { status: 400 }
      );
    }

    // Validar el acceso a Google Drive del organizador
    const { data: drive, error: errorDrive } =
      await supabaseAdmin
        .from("google_drive")
        .select("drive_folder_root_id, conectado")
        .eq("usuario_id", evento.usuario_id)
        .maybeSingle();

    if (errorDrive) {
      console.error(
        "Error al consultar la conexión de Drive:",
        errorDrive.message
      );

      return NextResponse.json(
        {
          ok: false,
          mensaje: "No fue posible consultar Google Drive.",
        },
        { status: 500 }
      );
    }

    if (
      !drive ||
      !drive.conectado ||
      !drive.drive_folder_root_id
    ) {
      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "El organizador aún no ha conectado Google Drive.",
        },
        { status: 400 }
      );
    }

    // Validar el contenido real de la imagen
    const buffer = Buffer.from(
      await archivo.arrayBuffer()
    );

    let metadata: sharp.Metadata;

    try {
      metadata = await sharp(buffer, {
        limitInputPixels: 40000000,
        failOn: "error",
      }).metadata();
    } catch {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "El archivo no es una imagen válida.",
        },
        { status: 415 }
      );
    }

    const formatosPermitidos = [
      "jpeg",
      "png",
      "webp",
    ];

    if (
      !metadata.format ||
      !formatosPermitidos.includes(metadata.format)
    ) {
      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "El contenido del archivo no corresponde a una imagen JPG, PNG o WebP.",
        },
        { status: 415 }
      );
    }

    // Generar la miniatura antes de subir archivos a Drive
    let miniatura: Buffer;

    try {
      miniatura = await sharp(buffer, {
        limitInputPixels: 40000000,
        failOn: "error",
      })
        .rotate()
        .resize({
          width: 800,
          height: 800,
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({
          quality: 80,
          mozjpeg: true,
        })
        .toBuffer();
    } catch (error) {
      console.error(
        "Error al generar la miniatura:",
        error
      );

      return NextResponse.json(
        {
          ok: false,
          mensaje: "No fue posible procesar la fotografía.",
        },
        { status: 422 }
      );
    }

    // Obtener un token válido del organizador
    const accessToken = await obtenerAccessTokenValido(
      evento.usuario_id
    );

    // Buscar o crear la carpeta del evento
    const carpetaEvento = await buscarOCrearCarpetaEvento(
      accessToken,
      drive.drive_folder_root_id,
      evento.nombre_evento
    );

    // Subir la fotografía original a Google Drive
    const archivoDrive = await subirArchivoDrive(
      accessToken,
      carpetaEvento.id,
      archivo
    );

    if (
      !archivoDrive ||
      archivoDrive.error ||
      !archivoDrive.id
    ) {
      console.error(
        "No fue posible subir la fotografía a Drive."
      );

      return NextResponse.json(
        {
          ok: false,
          mensaje: "No fue posible subir la fotografía a Google Drive.",
        },
        { status: 502 }
      );
    }

    // Subir la miniatura a Supabase Storage
    const nombreBase = archivo.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 100) || "fotografia";

    let thumbnail: { publicUrl: string };

    try {
      thumbnail = await subirMiniatura(
        `${nombreBase}-${crypto.randomUUID()}.jpg`,
        miniatura
      );
    } catch (error) {
      console.error(
        "Error al guardar la miniatura:",
        error
      );

      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "La fotografía se subió a Drive, pero no se pudo guardar su miniatura.",
        },
        { status: 500 }
      );
    }

    // Conservar el comportamiento actual de hacer pública la fotografía
    try {
      await hacerArchivoPublico(
        accessToken,
        archivoDrive.id
      );
    } catch (error) {
      console.error(
        "Error al configurar el acceso de la fotografía:",
        error
      );

      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "La fotografía se subió, pero no se pudo configurar su acceso.",
        },
        { status: 502 }
      );
    }

    // Registrar la fotografía en la base de datos
    const { error: errorFoto } = await supabaseAdmin
      .from("fotos_evento")
      .insert({
        evento_id: evento.id,
        usuario_id: evento.usuario_id,
        google_file_id: archivoDrive.id,
        google_url: archivoDrive.webViewLink ?? null,
        thumbnail_url: thumbnail.publicUrl,
        nombre_archivo: archivo.name.slice(0, 255),
        peso: archivo.size,
        ancho: metadata.width ?? null,
        alto: metadata.height ?? null,
        mime_type: archivo.type,
        estado: "ACTIVO",
      });

    if (errorFoto) {
      console.error(
        "Error al registrar la fotografía:",
        errorFoto.message
      );

      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "La fotografía se subió, pero no se pudo registrar en el sistema.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      mensaje: "Fotografía subida correctamente.",
      archivoDrive: {
        id: archivoDrive.id,
        name: archivoDrive.name,
        webViewLink: archivoDrive.webViewLink ?? null,
      },
    });
  } catch (error) {
    console.error(
      "Error inesperado al subir la fotografía:",
      error instanceof Error
        ? error.message
        : "Error desconocido"
    );

    return NextResponse.json(
      {
        ok: false,
        mensaje:
          "Ocurrió un error al subir la fotografía. Intenta nuevamente.",
      },
      { status: 500 }
    );
  }
}
