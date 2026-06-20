import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {

  try {

    const { correo, token } = await request.json();

    const enlace = `http://localhost:3000/reset-password?token=${token}`;

    const data = await resend.emails.send({

      from: "Flashboom Fotos <noreply@flashboomevents.com>",

      to: correo,

      subject: "Recupera tu contraseña de Flashboom Fotos",

      html: `
      
      <h2>Recuperación de contraseña</h2>

      <p>
      Recibimos una solicitud para restablecer tu contraseña.
      </p>

      <p>
      Da clic en el siguiente enlace:
      </p>

      <p>

      <a href="${enlace}">
      Restablecer contraseña
      </a>

      </p>

      <p>
      Si no solicitaste este cambio simplemente ignora este correo.
      </p>

      <br>

      <p>
      Flashboom Fotos
      </p>

      `

    });

    return NextResponse.json(data);

  }

  catch(error){

    console.log(error);

    return NextResponse.json(error);

  }

}