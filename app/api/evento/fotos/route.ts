console.log("VERSION NUEVA DE LA API");
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {

    const codigoEvento =
        request.nextUrl.searchParams.get("codigo");

    if (!codigoEvento) {

        return NextResponse.json({
            ok: false,
            mensaje: "Código no recibido."
        });

    }

    const { data: evento } = await supabaseAdmin

        .from("eventos")
        .select("id")
        .eq("codigo", codigoEvento)
        .single();
        if (!evento) {
            return NextResponse.json({
            ok: false,
            mensaje: "Evento no encontrado."
        });

    }

const { count } = await supabaseAdmin
    .from("fotos_evento")
    .select("*", {
        count: "exact",
        head: true
    })
    .eq("evento_id", evento.id)
    .eq("estado", "ACTIVO");

    const { data: fotos, error } = await supabaseAdmin

        .from("fotos_evento")
        .select("*")
        .eq("evento_id", evento.id)
        .not("google_file_id","is",null)
        .order("id", { ascending: false })
        .limit(6);
        if (error) {
           return NextResponse.json({
           ok: false,
           mensaje: error.message
        });

    }

   return NextResponse.json({
    ok: true,
    fotos,
    totalFotos: count ?? 0
});

}