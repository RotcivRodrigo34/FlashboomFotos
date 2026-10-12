"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useParams, useRouter } from "next/navigation";

export default function EditorPlantilla() {
  const params = useParams();
  const router = useRouter();

  const eventoId = params.id;
  const plantillaId = params.plantillaId;
  const codigoEvento = "viaje-a-acapulco-mmrjrx";

const urlEvento = `https://flashboom-fotos.vercel.app/evento/${codigoEvento}`;

  const [titulo, setTitulo] = useState("NUESTRA BODA");
  const [nombres, setNombres] = useState("Ana & Pedro");
  const [fecha, setFecha] = useState("25 de Octubre de 2026");
  const [mensaje, setMensaje] = useState(
    "Comparte tus mejores momentos con nosotros"
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-violet-50">

      {/* HEADER */}

      <header className="border-b bg-white/90 backdrop-blur">

        <div className="max-w-7xl mx-auto px-6 py-5">

          <button
            onClick={() => router.back()}
            className="text-violet-600 hover:underline"
          >
            ← Regresar
          </button>

        </div>

      </header>


      {/* CONTENIDO */}

      <section className="max-w-7xl mx-auto px-6 py-10">

        <div className="mb-10">

          <p className="text-violet-600 font-semibold">
            Plantilla {plantillaId}
          </p>

          <h1 className="text-4xl font-bold text-gray-900 mt-2">
            Personaliza tu plantilla
          </h1>

          <p className="text-gray-500 mt-3">
            Edita únicamente los textos permitidos. Los cambios se
            muestran en tiempo real.
          </p>

        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">


          {/* EDITOR */}

          <div className="bg-white rounded-3xl shadow-lg border border-violet-100 p-8">

            <h2 className="text-2xl font-bold text-gray-900">
              Personalización
            </h2>

            <p className="text-gray-500 mt-2 mb-8">
              Modifica los textos de tu diseño.
            </p>


            {/* TÍTULO */}

            <div className="mb-6">

              <div className="flex justify-between mb-2">

                <label className="font-semibold">
                  Título
                </label>

                <span className="text-sm text-gray-400">
                  {titulo.length}/30
                </span>

              </div>

              <input
                type="text"
                value={titulo}
                maxLength={30}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
              />

            </div>


            {/* NOMBRES */}

            <div className="mb-6">

              <div className="flex justify-between mb-2">

                <label className="font-semibold">
                  Nombres
                </label>

                <span className="text-sm text-gray-400">
                  {nombres.length}/40
                </span>

              </div>

              <input
                type="text"
                value={nombres}
                maxLength={40}
                onChange={(e) => setNombres(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
              />

            </div>


            {/* FECHA */}

            <div className="mb-6">

              <div className="flex justify-between mb-2">

                <label className="font-semibold">
                  Fecha
                </label>

                <span className="text-sm text-gray-400">
                  {fecha.length}/40
                </span>

              </div>

              <input
                type="text"
                value={fecha}
                maxLength={40}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
              />

            </div>


            {/* MENSAJE */}

            <div className="mb-8">

              <div className="flex justify-between mb-2">

                <label className="font-semibold">
                  Mensaje
                </label>

                <span className="text-sm text-gray-400">
                  {mensaje.length}/100
                </span>

              </div>

              <textarea
                value={mensaje}
                maxLength={100}
                rows={4}
                onChange={(e) => setMensaje(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500 resize-none"
              />

            </div>


            {/* QR */}

            <div className="bg-violet-50 rounded-2xl p-5 mb-8">

              <p className="font-semibold text-violet-800">
                🔗 Código QR
              </p>

              <p className="text-sm text-violet-600 mt-1">
                El código QR se generará automáticamente para este
                evento y no podrá modificarse.
              </p>

            </div>


            {/* GUARDAR */}

            <button
              onClick={() => {
                alert("Más adelante guardaremos esta configuración.");
              }}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-2xl font-semibold transition"
            >
              💾 Guardar plantilla
            </button>

          </div>


          {/* VISTA PREVIA */}

          <div>

            <div className="sticky top-6">

              <div className="bg-white rounded-3xl shadow-lg border border-violet-100 p-6">

                <h2 className="text-2xl font-bold mb-6">
                  Vista previa
                </h2>


                {/* PLANTILLA */}

                <div className="max-w-md mx-auto aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50 via-white to-rose-50 border shadow-xl p-8 flex flex-col items-center text-center">

                  {/* DECORACIÓN */}

                  <div className="text-5xl mb-8">
                    🌸
                  </div>


                  {/* TÍTULO */}

                  <p className="tracking-[0.25em] text-gray-700 text-sm">
                    {titulo}
                  </p>


                  {/* NOMBRES */}

                  <h2 className="text-4xl font-serif text-amber-700 mt-8">
                    {nombres}
                  </h2>


                  {/* SEPARADOR */}

                  <div className="flex items-center gap-4 my-6">

                    <div className="w-16 h-px bg-amber-500" />

                    <span>
                      ♥
                    </span>

                    <div className="w-16 h-px bg-amber-500" />

                  </div>


                  {/* FECHA */}

                  <p className="text-lg tracking-wider text-gray-700">
                    {fecha}
                  </p>


                  {/* QR */}

               <div className="mt-8 bg-white p-3 border-4 border-amber-500 rounded-xl">

  <QRCodeSVG
    value={urlEvento}
    size={128}
    level="H"
    includeMargin={true}
  />

</div>


                  {/* MENSAJE */}

                  <p className="mt-8 text-gray-700 text-base leading-relaxed max-w-xs">
                    {mensaje}
                  </p>


                  {/* DECORACIÓN */}

                  <div className="mt-auto text-3xl">
                    🌸
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}