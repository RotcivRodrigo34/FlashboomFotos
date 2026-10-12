
"use client";

import { useRef, useState } from "react";

interface Props {
  codigoEvento: string;
  onUploadComplete: () => void;
}

const MAX_FILE_SIZE = 15 * 1024 * 1024;

const TIPOS_PERMITIDOS = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function UploadButton({
  codigoEvento,
  onUploadComplete,
}: Props) {
  const inputFile = useRef<HTMLInputElement>(null);

  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [totalFotos, setTotalFotos] = useState(0);
  const [fotosSubidas, setFotosSubidas] = useState(0);
  const [enCola, setEnCola] = useState(false);

  async function subirArchivo(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (subiendo) return;

    const seleccionadas = Array.from(e.target.files ?? []);

    if (seleccionadas.length === 0) return;

    setMensaje("");
    setTotalFotos(seleccionadas.length);
    setFotosSubidas(0);
    setEnCola(true);
    setSubiendo(true);

    let exitosas = 0;
    let errores = 0;
    let mensajeError = "";

    try {
      // Validar los archivos antes de comenzar las cargas.
      const validas: File[] = [];

      for (const foto of seleccionadas) {
        if (!TIPOS_PERMITIDOS.includes(foto.type)) {
          errores++;
          mensajeError =
            "Solo se permiten imágenes JPG, PNG o WebP.";
          continue;
        }

        if (foto.size === 0 || foto.size > MAX_FILE_SIZE) {
          errores++;
          mensajeError =
            "Cada fotografía debe pesar más de 0 bytes y no superar 15 MB.";
          continue;
        }

        validas.push(foto);
      }

      // Subir las fotografías una por una.
      for (const foto of validas) {
        try {
          const formData = new FormData();

          formData.append("foto", foto);
          formData.append("codigoEvento", codigoEvento);

          const response = await fetch("/api/evento/upload", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          if (!response.ok || !data.ok) {
            errores++;
            mensajeError =
              data.mensaje ||
              `No se pudo subir ${foto.name}.`;
            continue;
          }

          exitosas++;
          setFotosSubidas(exitosas);

          // Actualizar la galería después de cada carga exitosa.
          onUploadComplete();
        } catch {
          errores++;
          mensajeError =
            `No se pudo completar la carga de ${foto.name}. Revisa tu conexión e intenta nuevamente.`;
        }
      }

      if (exitosas > 0 && errores === 0) {
        setMensaje(
          `✅ ¡Listo! Se subieron ${exitosas} ${
            exitosas === 1 ? "fotografía" : "fotografías"
          } correctamente.`
        );
      } else if (exitosas > 0 && errores > 0) {
        setMensaje(
          `⚠️ Se subieron ${exitosas} de ${seleccionadas.length}. ${mensajeError}`
        );
      } else {
        setMensaje(
          `❌ ${mensajeError || "No se pudo subir ninguna fotografía."}`
        );
      }
    } catch {
      setMensaje(
        "❌ Ocurrió un error durante la carga. Intenta nuevamente."
      );
    } finally {
      setSubiendo(false);
      setEnCola(false);

      // Permitir volver a seleccionar los mismos archivos.
      if (inputFile.current) {
        inputFile.current.value = "";
      }
    }
  }

  return (
    <>
      <input
        ref={inputFile}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={subiendo}
        className="hidden"
        onChange={subirArchivo}
      />

      <button
        type="button"
        disabled={subiendo}
        onClick={() => inputFile.current?.click()}
        className={`
          w-full
          text-white
          font-semibold
          text-lg
          py-4
          rounded-full
          transition
          shadow-lg
          ${
            subiendo
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-violet-600 hover:bg-violet-700"
          }
        `}
      >
        <div className="flex justify-center items-center gap-3">
          <span>
            {subiendo
              ? "⏳ Subiendo fotografías..."
              : "📷 Subir mis fotografías"}
          </span>
        </div>
      </button>

      {enCola && (
        <p className="text-center text-sm text-gray-600 mt-3">
          📤 Subiendo {fotosSubidas} de {totalFotos} fotografías...
        </p>
      )}

      {mensaje && (
        <p
          role="status"
          aria-live="polite"
          className="text-center mt-3 text-sm font-medium text-gray-700"
        >
          {mensaje}
        </p>
      )}
    </>
  );
}
