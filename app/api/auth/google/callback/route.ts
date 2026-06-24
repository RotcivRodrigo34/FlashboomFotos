import { NextRequest, NextResponse } from "next/server";
import { conectarGoogleDrive } from "@/lib/googleDriveService";

export async function GET(request: NextRequest) {

  try {

    const code = request.nextUrl.searchParams.get("code");

    const usuarioID = request.nextUrl.searchParams.get("state");

    if (!code || !usuarioID) {

      return NextResponse.json({

        error: "Código o usuario no recibido"

      });

    }

    const { error } = await conectarGoogleDrive(

      Number(usuarioID),

      code

    );

    if (error) {

      console.log(error);

      return NextResponse.json({

        error: error.message

      });

    }

    return NextResponse.redirect(

      new URL(

        "/dashboard?drive=ok",

        request.url

      )

    );

  }

  catch (error) {

    console.log(error);

    return NextResponse.json({

      error: "Error al conectar Google Drive"

    });

  }

}