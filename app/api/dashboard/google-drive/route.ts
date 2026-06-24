import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {

  const usuarioID = request.nextUrl.searchParams.get("usuario");

  if (!usuarioID) {

    return NextResponse.json({

      error: "Usuario no recibido"

    });

  }

  const { data, error } = await supabase

    .from("google_drive")

   .select(

`
google_email,
drive_folder_root_id,
drive_folder_root_nombre,
drive_total_storage,
drive_used_storage,
ultima_sincronizacion,
conectado
`

)

    .eq("usuario_id", Number(usuarioID))

    .maybeSingle();

  if (error) {

    return NextResponse.json({

      error: error.message

    });

  }

  return NextResponse.json(data);

}