
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import EventCard from "@/app/components/EventCard";
import Header from "@/app/components/Header";
import GoogleDriveCard from "@/app/components/GoogleDriveCard";

type Evento = {
  id: number;
  nombre_evento: string;
  fecha: string | null;
  ciudad: string | null;
};

export default function Dashboard() {
  const [abierto, setAbierto] = useState<number | null>(null);
  const [eventosDB, setEventosDB] = useState<Evento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargarDashboard() {
      const supabase = createClient();

      try {
        // Comprobar la sesión real de Supabase Auth
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          window.location.replace("/login");
          return;
        }

        // Obtener el perfil interno asociado a la sesión
        const { data: perfil, error: perfilError } = await supabase
          .from("usuarios")
          .select("id")
          .eq("auth_user_id", user.id)
          .maybeSingle();

        if (perfilError) {
          throw perfilError;
        }

        if (!perfil) {
          if (activo) {
            setMensaje(
              "No se encontró tu perfil. Contacta al administrador."
            );
          }
          return;
        }

        // Consultar los eventos del perfil autenticado
        const { data, error } = await supabase
          .from("eventos")
          .select("id, nombre_evento, fecha, ciudad")
          .eq("usuario_id", perfil.id)
          .order("fecha", { ascending: true });

        if (error) {
          throw error;
        }

        if (activo) {
          setEventosDB((data ?? []) as Evento[]);
        }
      } catch (error) {
        console.error("Error al cargar el dashboard:", error);

        if (activo) {
          setMensaje(
            "No fue posible cargar tus eventos. Intenta nuevamente."
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarDashboard();

    return () => {
      activo = false;
    };
  }, []);

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const eventosAgrupados = eventosDB.reduce<
    Record<string, Record<string, Evento[]>>
  >((acc, evento) => {
    const fecha = evento.fecha ? new Date(`${evento.fecha}T12:00:00`) : null;

    const anio = fecha
      ? String(fecha.getFullYear())
      : "Sin fecha";

    const mes = fecha
      ? meses[fecha.getMonth()]
      : "Fecha pendiente";

    if (!acc[anio]) {
      acc[anio] = {};
    }

    if (!acc[anio][mes]) {
      acc[anio][mes] = [];
    }

    acc[anio][mes].push(evento);

    return acc;
  }, {});

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-b from-white to-violet-50">
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold uppercase tracking-[4px] text-violet-600">
                Flashboom Fotos
              </p>

              <h1 className="mt-3 text-5xl font-bold">
                Mis Eventos
              </h1>

              <p className="mt-4 text-violet-600">
                Eventos contratados: {eventosDB.length}
              </p>
            </div>
          </div>

          <div className="mt-10">
            <GoogleDriveCard />
          </div>

          {cargando && (
            <p className="mt-10 text-gray-500">
              Cargando tus eventos...
            </p>
          )}

          {!cargando && mensaje && (
            <p className="mt-10 rounded-xl bg-red-50 p-4 text-red-700">
              {mensaje}
            </p>
          )}

          {!cargando && !mensaje && eventosDB.length === 0 && (
            <div className="mt-16 rounded-2xl border border-violet-100 bg-white p-8 text-center shadow-sm">
              <h2 className="text-2xl font-semibold">
                Aún no tienes eventos
              </h2>

              <p className="mt-3 text-gray-500">
                Cuando crees un evento, aparecerá aquí.
              </p>

              <Link
                href="/crear-album"
                className="mt-6 inline-block rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700"
              >
                Crear mi álbum
              </Link>
            </div>
          )}

          <div className="mt-16">
            {Object.keys(eventosAgrupados).map((anio) => (
              <div key={anio}>
                <h2 className="text-3xl font-bold">{anio}</h2>

                {Object.keys(eventosAgrupados[anio]).map((mes) => (
                  <div key={mes}>
                    <p className="mt-8 uppercase tracking-[3px] text-gray-400">
                      {mes}
                    </p>

                    <div className="mt-8 space-y-6">
                      {eventosAgrupados[anio][mes].map((evento) => (
                        <EventCard
                          key={evento.id}
                          evento={{
                            icono: "🎉",
                            nombre: evento.nombre_evento,
                            fecha: evento.fecha,
                            ciudad: evento.ciudad,
                          }}
                          index={evento.id}
                          abierto={abierto}
                          setAbierto={setAbierto}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
