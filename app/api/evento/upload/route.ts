import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

    ok: true,

    evento,

    nombre: archivo.name,

    tipo: archivo.type,

    tamaño: archivo.size

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