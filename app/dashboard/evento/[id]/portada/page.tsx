"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
type ImagenPortada = {
  posicion: number;
  imagen_url: string;
  storage_path: string;
};

export default function PortadaEvento() {
  const params = useParams();

  const idEvento = String(params.id);
  const router = useRouter();

function cerrarSesion() {
  localStorage.removeItem("logueado");
  localStorage.removeItem("usuarioID");

  router.push("/login");
}

  const [imagenes, setImagenes] = useState<ImagenPortada[]>([]);
  const [subiendo, setSubiendo] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarImagenes() {
      setCargando(true);

      const { data, error } = await supabase
        .from("imagenes_portada")
        .select("posicion, imagen_url, storage_path")
        .eq("evento_id", Number(idEvento))
        .order("posicion", { ascending: true });

      if (error) {
        console.error(error);
        alert(error.message);
        setCargando(false);
        return;
      }

      setImagenes(data || []);
      setCargando(false);
    }

    if (idEvento) {
      cargarImagenes();
    }
  }, [idEvento]);

  function obtenerImagen(posicion: number) {
    return imagenes.find(
      (imagen) => imagen.posicion === posicion
    );
  }

  async function subirImagen(
    event: React.ChangeEvent<HTMLInputElement>,
    posicion: number
  ) {
    const archivo = event.target.files?.[0];

    if (!archivo) {
      return;
    }

    if (!archivo.type.startsWith("image/")) {
      alert("Selecciona una imagen válida.");
      event.target.value = "";
      return;
    }

    setSubiendo(posicion);

    try {
      const extension =
        archivo.name.split(".").pop() || "jpg";

      const nombreArchivo =
        `${idEvento}/portada-${posicion}-${Date.now()}.${extension}`;

      const { error: errorStorage } =
        await supabase.storage
          .from("portadas")
          .upload(
            nombreArchivo,
            archivo,
            {
              contentType: archivo.type,
              upsert: false,
            }
          );

      if (errorStorage) {
        throw errorStorage;
      }

      const { data: urlData } =
        supabase.storage
          .from("portadas")
          .getPublicUrl(nombreArchivo);

      const imagenUrl = urlData.publicUrl;

      const { error: errorDB } =
        await supabase
          .from("imagenes_portada")
          .upsert(
            {
              evento_id: Number(idEvento),
              posicion,
              imagen_url: imagenUrl,
              storage_path: nombreArchivo,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: "evento_id,posicion",
            }
          );

      if (errorDB) {
        throw errorDB;
      }

      setImagenes((imagenesActuales) => {
        const otrasImagenes =
          imagenesActuales.filter(
            (imagen) => imagen.posicion !== posicion
          );

        return [
          ...otrasImagenes,
          {
            posicion,
            imagen_url: imagenUrl,
            storage_path: nombreArchivo,
          },
        ].sort(
          (a, b) => a.posicion - b.posicion
        );
      });

      alert("Imagen subida correctamente.");

    } catch (error: any) {
      console.error(error);

      alert(
        error.message ||
        "No se pudo subir la imagen."
      );

    } finally {
      setSubiendo(null);
      event.target.value = "";
    }
  }

return (
    <main className="min-h-screen bg-gradient-to-b from-white to-violet-50">

      <header className="w-full bg-white border-b shadow-sm">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO */}

          <Link href="/" className="flex items-center">

            <img
              src="/logofb.png"
              alt="FlashBoom Eventos"
              className="h-20 w-auto object-contain"
            />

          </Link>

          {/* MENÚ */}

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
              Cerrar Sesión
            </button>

            <Link
              href="/crear-album"
              className="
                bg-violet-600
                text-white
                px-6
                py-3
                rounded-xl
                hover:bg-violet-700
                transition
                font-medium
              "
            >
              Nuevo Evento
            </Link>

          </nav>

        </div>

      </header>

      <div className="max-w-5xl mx-auto py-12">

        <p className="text-violet-600 uppercase tracking-[4px] font-semibold">
          Flashboom Fotos
        </p>

        <h1 className="text-4xl font-bold mt-3">
          Imágenes de portada
        </h1>

        <p className="text-gray-500 mt-3">
          Administra las imágenes que aparecerán
          en la parte superior de tu evento.
        </p>

        <div className="mt-10 bg-white rounded-3xl shadow-lg border border-violet-100 p-8">

          <p className="text-gray-500">
            Evento ID:{" "}
            <span className="font-semibold text-gray-800">
              {idEvento}
            </span>
          </p>

          {cargando ? (

            <div className="text-center py-12 text-gray-400">
              Cargando imágenes...
            </div>

          ) : (

            <div className="grid md:grid-cols-3 gap-6 mt-8">

              {[1, 2, 3].map((posicion) => {

                const imagen =
                  obtenerImagen(posicion);

                return (

                  <div
                    key={posicion}
                    className="
                      border-2
                      border-dashed
                      border-violet-200
                      rounded-3xl
                      p-5
                      text-center
                    "
                  >

                    <p className="font-semibold mb-4">
                      Imagen {posicion}
                    </p>

                    <div
                      className="
                        w-full
                        aspect-[16/9]
                        rounded-2xl
                        overflow-hidden
                        bg-gray-100
                        flex
                        items-center
                        justify-center
                      "
                    >

                      {imagen ? (

                        <img
                          src={imagen.imagen_url}
                          alt={`Imagen de portada ${posicion}`}
                          className="
                            w-full
                            h-full
                            object-cover
                          "
                        />

                      ) : (

                        <div className="text-5xl">
                          🖼️
                        </div>

                      )}

                    </div>

                    <label
                      className="
                        mt-5
                        inline-block
                        border
                        rounded-2xl
                        px-5
                        py-3
                        hover:bg-violet-50
                        cursor-pointer
                      "
                    >

                      {subiendo === posicion
                        ? "Subiendo..."
                        : imagen
                          ? "Cambiar imagen"
                          : "Subir imagen"
                      }

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          subirImagen(
                            e,
                            posicion
                          )
                        }
                        disabled={
                          subiendo !== null
                        }
                      />

                    </label>

                  </div>

                );
              })}

            </div>

          )}

        </div>

      </div>

    </main>
  );
}