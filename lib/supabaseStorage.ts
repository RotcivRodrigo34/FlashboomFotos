import { supabaseAdmin } from "./supabaseAdmin";

export async function subirMiniatura(

    nombreArchivo: string,

    buffer: Buffer

) {

   const ruta = `${Date.now()}-thumb.jpg`;

    const { data, error } = await supabaseAdmin.storage

        .from("thumbnails")

     .upload(
    ruta,
    new Uint8Array(buffer),
    {
        contentType: "image/jpeg",
        upsert: false
    }
);

    if (error) {

        throw error;

    }

    const { data: url } = supabaseAdmin.storage

        .from("thumbnails")

        .getPublicUrl(ruta);

    return {

        ruta,

        publicUrl: url.publicUrl

    };

}