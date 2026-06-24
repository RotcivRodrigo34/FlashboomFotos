import { NextRequest, NextResponse } from "next/server";

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

    return NextResponse.json({

    ok:true,

    codigoEvento,

    nombre:archivo.name,

    tipo:archivo.type,

    tamaño:archivo.size

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