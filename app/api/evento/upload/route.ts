import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { obtenerAccessTokenValido } from "@/lib/googleToken";
import { subirMiniatura } from "@/lib/supabaseStorage";

import sharp from "sharp";
import {

buscarOCrearCarpetaEvento,

subirArchivoDrive,

hacerArchivoPublico

} from "@/lib/googleDriveUpload";

export async function POST(request: NextRequest) {
    console.log("======== UPLOAD NUEVO ========");
    console.log("VERSION NUEVA ROUTE");

    try {

        const formData = await request.formData();

        const archivo = formData.get("foto") as File | null;

        console.log("Nombre:", archivo?.name);
console.log("Tipo:", archivo?.type);
console.log("Tamaño:", archivo?.size);


        const codigoEvento=

formData.get("codigoEvento") as string;

        if (!archivo) {

            return NextResponse.json(
                {
                    ok: false,
                    mensaje: "No se recibió ninguna fotografía."
                },
                {
                    status: 400
                }
            );

        }

 const { data: evento, error } = await supabaseAdmin
    .from("eventos")
    .select("*")
    .eq("codigo", codigoEvento)
    .single();

    if (error || !evento) {

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

    const { data: drive, error: errorDrive } = await supabaseAdmin
    
    .from("google_drive")
    .select("*")
    .eq("usuario_id", evento.usuario_id)
    .single();
console.log("================================");
console.log("USUARIO DEL EVENTO:", evento.usuario_id);
console.log("DRIVE:", drive);
console.log("ERROR DRIVE:", errorDrive);
console.log("================================");
    if (errorDrive || !drive) {

    return NextResponse.json(
        {
            ok: false,
            mensaje: "El organizador aún no ha conectado Google Drive."
        },
        {
            status: 400
        }
    );

}
console.log("EVENTO:", evento);

console.log("DRIVE:", drive);

console.log("ERROR DRIVE:", errorDrive);
const accessToken = await obtenerAccessTokenValido(
    evento.usuario_id
);

const carpetaEvento =
await buscarOCrearCarpetaEvento(

    accessToken,

    drive.drive_folder_root_id,

    evento.nombre_evento

);
const archivoDrive =
await subirArchivoDrive(

    accessToken,

    carpetaEvento.id,

    archivo

);
const buffer = Buffer.from(
    await archivo.arrayBuffer()
);


console.log("================================");
console.log("NOMBRE:", archivo.name);
console.log("TIPO:", archivo.type);
console.log("BUFFER:", buffer.length);
console.log("================================");

const metadata = await sharp(buffer).metadata();

console.log("========== METADATA ==========");
console.log({
    format: metadata.format,
    width: metadata.width,
    height: metadata.height,
    orientation: metadata.orientation
});
console.log("==============================");
console.log("EMPEZANDO SHARP RESIZE...");
console.log("EMPEZANDO SHARP RESIZE...");

let miniatura: Buffer;

try {

    miniatura = await sharp(buffer)
        .rotate()
        .resize({
            width: 800,
            height: 800,
            fit: "inside",
            withoutEnlargement: true
        })
        .jpeg({
            quality: 80,
            mozjpeg: true
        })
        .toBuffer();

    console.log("SHARP TERMINÓ");
    console.log("Miniatura:", miniatura.length);

} catch (e) {

    console.error("ERROR EN SHARP");
    console.error(e);
    throw e;

}

console.log("Miniatura guardada localmente");

console.log("MINIATURA GENERADA");
console.log("Bytes:", miniatura.length);

console.log("Miniatura bytes:", miniatura.length);

console.log("Subiendo miniatura a Supabase...");

const thumbnail = await subirMiniatura(
    archivo.name.replace(/\.(png|jpg|jpeg|heic)$/i, ".jpg"),
    miniatura
);
    console.log("Miniatura subida correctamente");
console.log(thumbnail);
console.log("Miniatura tamaño:", miniatura.length);
console.log(miniatura.slice(0,20));


console.log(miniatura.length);

await hacerArchivoPublico(

    accessToken,

    archivoDrive.id

);
if (archivoDrive.error) {

    return NextResponse.json({

        ok: false,

        mensaje: archivoDrive.error.message

    });

}
console.log("Insertando foto:", {
  evento_id: evento.id,
  usuario_id: evento.usuario_id,
  google_file_id: archivoDrive.id,
  google_url: archivoDrive.webViewLink,
  nombre_archivo: archivo.name,
  peso: archivo.size,
  mime_type: archivo.type
});
const { error: errorFoto } = await supabaseAdmin

.from("fotos_evento")

.insert({

    evento_id: evento.id,

    usuario_id: evento.usuario_id,

    google_file_id: archivoDrive.id,

    google_url: archivoDrive.webViewLink,
    thumbnail_url: thumbnail.publicUrl,

    nombre_archivo: archivo.name,

    peso: archivo.size,

    mime_type: archivo.type,

    estado: "ACTIVO"
    

});

if(errorFoto){

    return NextResponse.json({

        ok:false,

        mensaje:errorFoto.message

    });

}
console.log(archivoDrive);

console.log(carpetaEvento);





return NextResponse.json({

    ok:true,

    mensaje:"Fotografía subida correctamente.",

    archivoDrive

});

    }

catch (error) {

    console.error("========== ERROR ==========");
    console.error(error);
    console.error("===========================");

    return NextResponse.json({
        ok: false,
        mensaje: error instanceof Error
            ? error.message
            : JSON.stringify(error)
    });

}

}