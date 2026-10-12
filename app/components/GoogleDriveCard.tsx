
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface GoogleDriveData {
  google_email?: string;
  drive_folder_root_id?: string;
  drive_folder_root_nombre?: string;
  drive_total_storage?: number | null;
  drive_used_storage?: number | null;
  ultima_sincronizacion?: string | null;
  conectado: boolean;
}

export default function GoogleDriveCard() {
  const [datos, setDatos] = useState<GoogleDriveData | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false;

    async function cargarDrive() {
      setCargando(true);
      setError("");

      try {
        const supabase = createClient();
        const {
          data: { user },
          error: errorSesion,
        } = await supabase.auth.getUser();

        if (errorSesion || !user) {
          if (!cancelado) {
            setError("Tu sesión no está activa. Inicia sesión nuevamente.");
          }
          return;
        }

        const response = await fetch("/api/dashboard/google-drive", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "No fue posible consultar Google Drive.");
        }

        if (!cancelado) {
          setDatos(data);
        }
      } catch (err) {
        if (!cancelado) {
          setError(
            err instanceof Error
              ? err.message
              : "No fue posible cargar Google Drive."
          );
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }

    cargarDrive();

    return () => {
      cancelado = true;
    };
  }, []);

  if (cargando) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        Cargando Google Drive...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <h2 className="text-2xl font-bold">Google Drive</h2>
        <p className="text-red-600 mt-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-5 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-2xl"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!datos?.conectado) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">☁️</span>
            <h2 className="text-2xl font-bold">Google Drive</h2>
          </div>
          <span className="font-semibold text-red-600">No conectado</span>
        </div>

        <p className="text-gray-500 mt-8 leading-7">
          Conecta tu cuenta de Google Drive para almacenar las fotografías de
          tus invitados directamente en tu nube.
        </p>

        <div className="flex justify-end mt-8">
          <button
            onClick={() => {
              window.location.href = "/api/auth/google/login";
            }}
            className="bg-violet-600 hover:bg-violet-700 transition text-white px-6 py-3 rounded-2xl"
          >
            Conectar Google Drive
          </button>
        </div>
      </div>
    );
  }

  const total = datos.drive_total_storage ?? 15;
  const usado = datos.drive_used_storage ?? 0;
  const porcentaje = total > 0 ? Math.min((usado / total) * 100, 100) : 0;

  function tiempoRelativo(fecha?: string | null) {
    if (!fecha) return "Sin sincronizaciones registradas";

    const tiempo = new Date(fecha).getTime();
    if (!Number.isFinite(tiempo)) return "Sin datos de sincronización";

    const minutos = Math.max(0, Math.floor((Date.now() - tiempo) / 60000));

    if (minutos < 1) return "Hace unos segundos";
    if (minutos === 1) return "Hace 1 minuto";
    if (minutos < 60) return `Hace ${minutos} minutos`;

    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `Hace ${horas} horas`;

    return `Hace ${Math.floor(horas / 24)} días`;
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">☁️</span>
          <h2 className="text-2xl font-bold">Google Drive</h2>
        </div>
        <span className="font-semibold text-green-600">Conectado</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-10">
        <div>
          <p className="text-gray-400 text-sm">Cuenta</p>
          <p className="font-semibold break-all">{datos.google_email || "Sin datos"}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Carpeta raíz</p>
          <p className="font-semibold">{datos.drive_folder_root_nombre || "FlashboomFotos"}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Espacio utilizado</p>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
            <div
              className="bg-violet-600 h-3 rounded-full"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
          <p className="mt-2">
            {usado} MB / {total} GB
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Última sincronización</p>
          <p>{tiempoRelativo(datos.ultima_sincronizacion)}</p>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-10">
        <button
          onClick={() => {
            if (datos.drive_folder_root_id) {
              window.open(
                `https://drive.google.com/drive/folders/${encodeURIComponent(datos.drive_folder_root_id)}`,
                "_blank",
                "noopener,noreferrer"
              );
            }
          }}
          disabled={!datos.drive_folder_root_id}
          className="border border-gray-300 hover:bg-gray-100 transition px-6 py-3 rounded-2xl disabled:opacity-50"
        >
          Abrir carpeta
        </button>

        <button
          onClick={() => {
            window.location.href = "/api/auth/google/login";
          }}
          className="bg-violet-600 hover:bg-violet-700 transition text-white px-6 py-3 rounded-2xl"
        >
          Reconectar
        </button>
      </div>
    </div>
  );
}
