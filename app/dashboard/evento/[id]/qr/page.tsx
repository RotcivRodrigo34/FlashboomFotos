"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Evento = {
  id: number;
  nombre_evento: string;
  codigo: string;
  fecha: string | null;
  ciudad: string | null;
};

export default function QREvento() {
  const params = useParams();
  const router = useRouter();

  const idEvento = String(params.id);

  const [evento, setEvento] = useState<Evento | null>(null);
  const [imagenQR, setImagenQR] = useState("");
  const [enlaceAlbum, setEnlaceAlbum] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarEvento() {
      setCargando(true);
      setError("");

      try {
        const supabase = createClient();

const { data, error: errorEvento } = await supabase
  .from("eventos")
  .select("id, nombre_evento, codigo, fecha, ciudad")
  .eq("id", Number(idEvento))
  .maybeSingle();

console.log("ID de la ruta:", idEvento);
console.log("Evento encontrado:", data);
console.log("Error de Supabase:", errorEvento);

if (errorEvento) {
  throw errorEvento;
}

if (!data) {
  setError(
    `No se encontró el evento con ID ${idEvento}. Revisa el acceso a la tabla eventos.`
  );
  return;
}

const urlAlbum = `${window.location.origin}/evento/${encodeURIComponent(data.codigo)}`;

       
const qr = await QRCode.toDataURL(urlAlbum, {
  width: 400,
  margin: 2,
  errorCorrectionLevel: "H",
  color: {
    dark: "#000000",
    light: "#ffffff",
  },
});


        setEvento(data as Evento);
        setEnlaceAlbum(urlAlbum);
        setImagenQR(qr);
      } catch (err) {
        console.error("Error al cargar el QR:", err);
        setError("No fue posible generar el QR del evento.");
      } finally {
        setCargando(false);
      }
    }

    if (idEvento && idEvento !== "undefined") {
      cargarEvento();
    } else {
      setError("El identificador del evento no es válido.");
      setCargando(false);
    }
  }, [idEvento]);

  function descargarQR() {
    if (!imagenQR || !evento) return;

    const enlace = document.createElement("a");
    enlace.href = imagenQR;
    enlace.download = `QR-${evento.nombre_evento.replace(/[^a-z0-9]/gi, "-")}.png`;
    enlace.click();
  }

  function cerrarSesion() {
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-violet-50">
      <header className="w-full bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img
              src="/logofb.png"
              alt="FlashBoom Eventos"
              className="h-20 w-auto object-contain"
            />
          </Link>

          <nav className="flex items-center gap-7 text-sm">
            <Link
              href="/"
              className="text-gray-700 hover:text-violet-600 transition"
            >
              Inicio
            </Link>

            <Link
              href="/dashboard"
              className="text-violet-600 font-semibold"
            >
              Mis Eventos
            </Link>

            <button
              onClick={cerrarSesion}
              className="text-gray-700 hover:text-violet-600 transition"
            >
              Volver
            </button>
          </nav>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-violet-600 uppercase tracking-[4px] font-semibold">
          Flashboom Fotos
        </p>

        <h1 className="text-4xl font-bold mt-3">
          Código QR del evento
        </h1>

        <p className="text-gray-500 mt-3">
          Comparte este código con tus invitados para que puedan acceder
          al álbum de tu evento.
        </p>

        {cargando ? (
          <div className="mt-10 bg-white rounded-3xl shadow-lg p-10 text-center text-gray-500">
            Cargando evento y generando QR...
          </div>
        ) : error ? (
          <div className="mt-10 bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
            {error}
          </div>
        ) : evento ? (
          <div className="mt-10 grid md:grid-cols-2 gap-8 items-start">
            <div className="bg-white rounded-3xl shadow-lg border border-violet-100 p-8">
              <h2 className="text-2xl font-bold">
                {evento.nombre_evento}
              </h2>

              <p className="text-gray-500 mt-3">
                📅 {evento.fecha || "Fecha pendiente"}
              </p>

              <p className="text-gray-500 mt-2">
                📍 {evento.ciudad || "Ciudad pendiente"}
              </p>

              <div className="mt-8 flex justify-center">
                {imagenQR && (
                  <img
                    src={imagenQR}
                    alt={`Código QR de ${evento.nombre_evento}`}
                    className="w-full max-w-[320px] rounded-xl"
                  />
                )}
              </div>

              <button
                onClick={descargarQR}
                className="mt-8 w-full bg-violet-600 text-white rounded-2xl py-4 font-semibold hover:bg-violet-700 transition"
              >
                Descargar código QR
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-violet-100 p-8">
              <h2 className="text-xl font-bold">
                Enlace del álbum
              </h2>

              <p className="text-gray-500 mt-3">
                Este es el enlace que se codificó en el QR.
              </p>

              <div className="mt-5 rounded-xl bg-violet-50 border border-violet-100 p-4 break-all text-sm text-violet-900">
                {enlaceAlbum}
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(enlaceAlbum);
                  alert("Enlace copiado.");
                }}
                className="mt-4 w-full border border-violet-200 rounded-2xl py-3 hover:bg-violet-50 transition"
              >
                Copiar enlace
              </button>

            </div>
          </div>
        ) : null}

        <Link
          href="/dashboard"
          className="inline-block mt-8 text-violet-700 font-semibold hover:text-violet-900"
        >
          ← Volver a mis eventos
        </Link>
      </section>
    </main>
  );
}
