"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const plantillas = [
  {
    id: 1,
    nombre: "Plantilla 01",
    categoria: "Boda",
  },
  {
    id: 2,
    nombre: "Plantilla 02",
    categoria: "XV Años",
  },
  {
    id: 3,
    nombre: "Plantilla 03",
    categoria: "Fiesta",
  },
  {
    id: 4,
    nombre: "Plantilla 04",
    categoria: "Boda",
  },
  {
    id: 5,
    nombre: "Plantilla 05",
    categoria: "Cumpleaños",
  },
  {
    id: 6,
    nombre: "Plantilla 06",
    categoria: "Graduación",
  },
];

export default function PlantillasEvento() {
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  function seleccionarPlantilla(plantillaId: number) {
    router.push(
      `/dashboard/evento/${id}/plantillas/${plantillaId}`
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-violet-50">

      {/* HEADER */}

      <header className="border-b bg-white/90 backdrop-blur">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <Link href="/dashboard">
            <img
              src="/logofb.png"
              alt="Flashboom Fotos"
              className="h-10 w-auto"
            />
          </Link>

          <div className="flex items-center gap-6">

            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-violet-600"
            >
              Inicio
            </Link>

            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-violet-600"
            >
              Mis Eventos
            </Link>

          </div>

        </div>

      </header>


      {/* CONTENIDO */}

      <section className="max-w-7xl mx-auto px-6 py-12">

        <div className="mb-10">

          <button
            onClick={() => router.back()}
            className="text-violet-600 hover:underline mb-5"
          >
            ← Regresar
          </button>

          <h1 className="text-4xl font-bold text-gray-900">
            Elige tu plantilla
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Selecciona un diseño para personalizarlo para tu evento.
          </p>

        </div>


        {/* PLANTILLAS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {plantillas.map((plantilla) => (

            <div
              key={plantilla.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-violet-100 hover:shadow-xl transition"
            >

              {/* PREVISUALIZACIÓN */}

              <div className="aspect-[4/5] bg-gradient-to-br from-violet-100 via-white to-pink-100 flex items-center justify-center p-8">

                <div className="w-full h-full rounded-2xl bg-white shadow-md border flex flex-col items-center justify-center text-center p-6">

                  <span className="text-4xl mb-5">
                    ✨
                  </span>

                  <h2 className="text-2xl font-bold text-gray-800">
                    {plantilla.nombre}
                  </h2>

                  <p className="text-gray-500 mt-2">
                    {plantilla.categoria}
                  </p>

                  <div className="mt-8 w-20 h-20 border-4 border-gray-800 flex items-center justify-center text-xs font-bold">
                    QR
                  </div>

                </div>

              </div>


              {/* INFORMACIÓN */}

              <div className="p-6">

                <h2 className="text-xl font-semibold">
                  {plantilla.nombre}
                </h2>

                <p className="text-gray-500 mt-1">
                  {plantilla.categoria}
                </p>

                <button
                  onClick={() =>
                    seleccionarPlantilla(plantilla.id)
                  }
                  className="w-full mt-5 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-2xl transition"
                >
                  Personalizar
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}