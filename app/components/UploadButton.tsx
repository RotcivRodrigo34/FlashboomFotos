
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
  const [fotosProcesadas, setFotosProcesadas] = useState(0);
  const [fotosSubidas, setFotosSubidas] = useState(0);
  const [enCola, setEnCola] = useState(false);

  const porcentaje =
    totalFotos > 0
      ? Math.round((fotosProcesadas / totalFotos) * 100)
      : 0;

  async function subirArchivo(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (subiendo) return;

    const seleccionadas = Array.from(e.target.files ?? []);

    if (seleccionadas.length === 0) return;

    setMensaje("");
    setTotalFotos(seleccionadas.length);
    setFotosProcesadas(0);
    setFotosSubidas(0);
    setEnCola(true);
    setSubiendo(true);

    let exitosas = 0;
    let errores = 0;
    let mensajeError = "";

    try {
      const validas: File[] = [];
      let invalidas = 0;

      // Validar las fotografías seleccionadas.
      for (const foto of seleccionadas) {
        if (!TIPOS_PERMITIDOS.includes(foto.type)) {
          errores++;
          invalidas++;
          mensajeError =
            "Solo se permiten imágenes JPG, PNG o WebP.";
          continue;
        }

        if (foto.size === 0 || foto.size > MAX_FILE_SIZE) {
          errores++;
          invalidas++;
          mensajeError =
            "Cada fotografía debe pesar más de 0 bytes y no superar 15 MB.";
          continue;
        }

        validas.push(foto);
      }

      // Contar como procesados los archivos descartados
      // durante la validación.
      setFotosProcesadas(invalidas);

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
          } else {
            exitosas++;
            setFotosSubidas(exitosas);

            // Actualizar la galería tras cada carga exitosa.
            onUploadComplete();
          }
        } catch {
          errores++;
          mensajeError =
            `No se pudo completar la carga de ${foto.name}. Revisa tu conexión e intenta nuevamente.`;
        } finally {
          setFotosProcesadas((prev) => prev + 1);
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
          `⚠️ Se subieron ${exitosas} de ${seleccionadas.length} fotografías. ${mensajeError}`
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

      if (inputFile.current) {
        inputFile.current.value = "";
      }
    }
  }

  return (
    <div className="w-full">
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
        <span className="flex justify-center items-center gap-3">
          {subiendo
            ? "⏳ Subiendo fotografías..."
            : "📷 Subir mis fotografías"}
        </span>
      </button>

      {enCola && (
        <div
          className="mt-4 space-y-2"
          role="status"
          aria-live="polite"
        >
          <div className="flex justify-between items-center text-sm text-gray-700">
            <span>
              {fotosProcesadas} de {totalFotos} fotografías procesadas
            </span>
            <span className="font-bold text-violet-700">
              {porcentaje}%
            </span>
          </div>

          <div
            className="w-full h-3 rounded-full bg-gray-200 overflow-hidden"
            role="progressbar"
            aria-label="Progreso de carga de fotografías"
            aria-valuemin={0}
            aria-valuemax={totalFotos}
            aria-valuenow={fotosProcesadas}
          >
            <div
              className="h-full rounded-full bg-violet-600 transition-all duration-300 ease-out"
              style={{ width: `${porcentaje}%` }}
            />
          </div>

          <p className="text-center text-sm text-gray-600">
            {fotosSubidas > 0
              ? `✅ ${fotosSubidas} fotografías subidas correctamente`
              : "Preparando tus fotografías..."}
          </p>
        </div>
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
    </div>
  );
}
