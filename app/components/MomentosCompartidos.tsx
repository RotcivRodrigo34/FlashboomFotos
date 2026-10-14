
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  codigoEvento: string;
  refresh: number;
}

interface Foto {
  id: number;
  google_file_id: string;
  thumbnail_url: string;
  nombre_archivo: string;
}

export default function MomentosCompartidos({
  codigoEvento,
  refresh,
}: Props) {
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [fotosGaleria, setFotosGaleria] = useState<Foto[]>([]);
  const [totalFotos, setTotalFotos] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [fotoSeleccionada, setFotoSeleccionada] =
    useState<Foto | null>(null);
  const [galeriaAbierta, setGaleriaAbierta] = useState(false);
  const [cargandoGaleria, setCargandoGaleria] = useState(false);
  const [errorGaleria, setErrorGaleria] = useState("");

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    let cancelado = false;

    async function cargarFotos() {
      setCargando(true);

      try {
        const response = await fetch(
          `/api/evento/fotos?codigo=${encodeURIComponent(codigoEvento)}`
        );

        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(
            data.mensaje || "No fue posible cargar las fotografías."
          );
        }

        if (!cancelado) {
          setFotos(data.fotos ?? []);
          setTotalFotos(data.totalFotos ?? 0);
        }
      } catch (error) {
        console.error("Error al cargar fotografías:", error);

        if (!cancelado) {
          setFotos([]);
          setTotalFotos(0);
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }

    cargarFotos();

    return () => {
      cancelado = true;
    };
  }, [codigoEvento, refresh]);

  const fotosNavegacion = galeriaAbierta
    ? fotosGaleria
    : fotos;

  const siguienteFoto = useCallback(() => {
    if (!fotoSeleccionada || fotosNavegacion.length === 0) {
      return;
    }

    const indiceActual = fotosNavegacion.findIndex(
      (foto) => foto.id === fotoSeleccionada.id
    );

    if (indiceActual === -1) return;

    const siguienteIndice =
      (indiceActual + 1) % fotosNavegacion.length;

    setFotoSeleccionada(fotosNavegacion[siguienteIndice]);
  }, [fotoSeleccionada, fotosNavegacion]);

  const anteriorFoto = useCallback(() => {
    if (!fotoSeleccionada || fotosNavegacion.length === 0) {
      return;
    }

    const indiceActual = fotosNavegacion.findIndex(
      (foto) => foto.id === fotoSeleccionada.id
    );

    if (indiceActual === -1) return;

    const anteriorIndice =
      (indiceActual - 1 + fotosNavegacion.length) %
      fotosNavegacion.length;

    setFotoSeleccionada(fotosNavegacion[anteriorIndice]);
  }, [fotoSeleccionada, fotosNavegacion]);

  useEffect(() => {
    if (!fotoSeleccionada) return;

    function manejarTeclado(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        siguienteFoto();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        anteriorFoto();
      }

      if (event.key === "Escape") {
        setFotoSeleccionada(null);
      }
    }

    window.addEventListener("keydown", manejarTeclado);

    return () => {
      window.removeEventListener("keydown", manejarTeclado);
    };
  }, [fotoSeleccionada, siguienteFoto, anteriorFoto]);

  function manejarTouchStart(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    touchStartX.current = event.touches[0].clientX;
    touchEndX.current = null;
  }

  function manejarTouchMove(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    touchEndX.current = event.touches[0].clientX;
  }

  function manejarTouchEnd() {
    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      return;
    }

    const distancia =
      touchStartX.current - touchEndX.current;

    if (distancia > 50) siguienteFoto();
    if (distancia < -50) anteriorFoto();

    touchStartX.current = null;
    touchEndX.current = null;
  }

  async function abrirGaleria() {
    setCargandoGaleria(true);
    setErrorGaleria("");

    try {
      const response = await fetch(
        `/api/evento/fotos?codigo=${encodeURIComponent(codigoEvento)}&todas=true`
      );

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(
          data.mensaje || "No fue posible cargar la galería."
        );
      }

      setFotosGaleria(data.fotos ?? []);
      setGaleriaAbierta(true);
    } catch (error) {
      console.error("Error al cargar la galería:", error);
      setErrorGaleria(
        error instanceof Error
          ? error.message
          : "No fue posible cargar la galería."
      );
    } finally {
      setCargandoGaleria(false);
    }
  }

  return (
    <section className="px-4 mt-5 pb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold tracking-tight text-gray-900">
          Momentos compartidos
        </h3>

        <span className="text-sm text-gray-500">
          {totalFotos} fotos
        </span>
      </div>

      {cargando && (
        <p className="text-center text-gray-400 py-10">
          Cargando fotografías...
        </p>
      )}

      {!cargando && fotos.length === 0 && (
        <p className="text-center text-gray-400 py-10">
          Aún no hay fotografías.
        </p>
      )}

      <div className="grid grid-cols-3 gap-2">
        {fotos.map((foto) => (
          <button
            type="button"
            key={foto.id}
            onClick={() => setFotoSeleccionada(foto)}
            aria-label={`Ver fotografía ${foto.nombre_archivo}`}
            className="aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm flex items-center justify-center cursor-pointer"
          >
            <img
              src={foto.thumbnail_url}
              alt={foto.nombre_archivo}
              loading="lazy"
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={abrirGaleria}
          disabled={cargandoGaleria}
          className="text-sm font-semibold text-gray-600 hover:text-gray-900 disabled:opacity-50"
        >
          {cargandoGaleria ? "Cargando galería..." : "Ver galería"}
        </button>

        {errorGaleria && (
          <p role="alert" className="text-sm text-red-600 mt-2">
            {errorGaleria}
          </p>
        )}
      </div>

      {galeriaAbierta && (
        <div className="fixed inset-0 z-40 bg-white overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Galería
            </h2>

            <button
              type="button"
              onClick={() => setGaleriaAbierta(false)}
              className="text-2xl text-gray-500 w-10 h-10 flex items-center justify-center"
              aria-label="Cerrar galería"
            >
              &#215;
            </button>
          </div>

          {fotosGaleria.length === 0 ? (
            <p className="text-center text-gray-400 py-10">
              Aún no hay fotografías en la galería.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {fotosGaleria.map((foto) => (
                <button
                  type="button"
                  key={foto.id}
                  onClick={() => setFotoSeleccionada(foto)}
                  aria-label={`Ver fotografía ${foto.nombre_archivo}`}
                  className="aspect-square rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer"
                >
                  <img
                    src={foto.thumbnail_url}
                    alt={foto.nombre_archivo}
                    loading="lazy"
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {fotoSeleccionada && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onTouchStart={manejarTouchStart}
          onTouchMove={manejarTouchMove}
          onTouchEnd={manejarTouchEnd}
        >
          <button
            type="button"
            onClick={() => setFotoSeleccionada(null)}
            className="absolute top-4 right-4 text-white text-3xl font-bold w-10 h-10 flex items-center justify-center z-20"
            aria-label="Cerrar fotografía"
          >
            &#215;
          </button>

          {fotosNavegacion.length > 1 && (
            <button
              type="button"
              onClick={anteriorFoto}
              className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/40 hover:bg-black/60 text-white text-3xl flex items-center justify-center transition"
              aria-label="Fotografía anterior"
            >
              &#8249;
            </button>
          )}

          <img
            src={fotoSeleccionada.thumbnail_url}
            alt={fotoSeleccionada.nombre_archivo}
            className="max-w-full max-h-[85vh] object-contain rounded-lg select-none"
            draggable={false}
          />

          {fotosNavegacion.length > 1 && (
            <button
              type="button"
              onClick={siguienteFoto}
              className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/40 hover:bg-black/60 text-white text-3xl flex items-center justify-center transition"
              aria-label="Fotografía siguiente"
            >
              &#8250;
            </button>
          )}

          <a
            href={`/api/evento/download/${fotoSeleccionada.id}?codigo=${encodeURIComponent(codigoEvento)}`}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-5 py-2 rounded-full font-semibold shadow-lg z-20"
          >
            Descargar
          </a>
        </div>
      )}
    </section>
  );
}
