import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

  const code = request.nextUrl.searchParams.get("code");

  console.log("Código recibido:", code);

  return NextResponse.json({

    mensaje: "Callback recibido correctamente",

    code

  });

}