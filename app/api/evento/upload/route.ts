import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {

buscarOCrearCarpetaEvento,

subirArchivoDrive

} from "@/lib/googleDriveUpload";

export async function POST(request: NextRequest) {

    try {

        const formData = await request.formData();

        const archivo = formData.get("foto") as File | null;
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

 const { data: evento, error } = await supabase
    .from("eventos")
    .select("*")
    .eq("codigo", codigoEvento)
    .single();

    const { data: drive, error: errorDrive } = await supabase
    .from("google_drive")
    .select("*")
    .eq("usuario_id", evento.usuario_id)
    .single();

    const carpetaEvento=

await buscarOCrearCarpetaEvento(

drive.access_token,

drive.drive_folder_root_id,

evento.nombre_evento

);
const archivoDrive=

await subirArchivoDrive(

drive.access_token,

carpetaEvento.id,

archivo

);
const { error: errorFoto } = await supabase

.from("fotos_evento")

.insert({

    evento_id: evento.id,

    usuario_id: evento.usuario_id,

    google_file_id: archivoDrive.id,

    google_url: archivoDrive.webViewLink,

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

return NextResponse.json({

    ok:true,

    mensaje:"Fotografía subida correctamente.",

    archivoDrive

});

    }

    catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                ok: false,
                mensaje: "Error al procesar la imagen."
            },
            {
                status: 500
            }
        );

    }

}