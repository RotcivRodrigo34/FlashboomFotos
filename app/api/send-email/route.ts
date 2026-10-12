
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("Falta configurar RESEND_API_KEY.");

      return NextResponse.json(
        { error: "El servicio de correo no está disponible." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const correo =
      typeof body.correo === "string"
        ? body.correo.trim().toLowerCase()
        : "";

    const token =
      typeof body.token === "string"
        ? body.token.trim()
        : "";

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) ||
      !/^[a-fA-F0-9-]{32,64}$/.test(token)
    ) {
      return NextResponse.json(
        { error: "Los datos de recuperación no son válidos." },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!baseUrl) {
      console.error("Falta configurar NEXT_PUBLIC_APP_URL.");

      return NextResponse.json(
        { error: "No se pudo generar el enlace de recuperación." },
        { status: 500 }
      );
    }

    const enlace = new URL("/reset-password", baseUrl);
    enlace.searchParams.set("token", token);

    const { data, error } = await resend.emails.send({
      from: "Flashboom Fotos <noreply@flashboomevents.com>",
      to: [correo],
      subject: "Recupera tu contraseña de Flashboom Fotos",
      html: `
        <h2>Recuperación de contraseña</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace:</p>
        <p>
          <a href="${enlace.toString()}">
            Restablecer contraseña
          </a>
        </p>
        <p>
          Si no solicitaste este cambio, simplemente ignora este correo.
        </p>
        <br>
        <p>Flashboom Fotos</p>
      `,
    });

    if (error) {
      console.error("Error al enviar correo de recuperación.");

      return NextResponse.json(
        { error: "No fue posible enviar el correo de recuperación." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      mensaje: "Correo de recuperación enviado.",
      id: data?.id,
    });
  } catch (error) {
    console.error(
      "Error en el envío del correo:",
      error instanceof Error ? error.message : "Error desconocido"
    );

    return NextResponse.json(
      { error: "Ocurrió un error al procesar el envío." },
      { status: 500 }
    );
  }
}
