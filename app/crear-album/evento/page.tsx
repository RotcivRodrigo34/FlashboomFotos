"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Evento() {
  const router = useRouter();

  const [evento, setEvento] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [fecha, setFecha] = useState("");
  const [estado, setEstado] = useState("");
  const [ciudad, setCiudad] = useState("");

  const [modoNuevoEvento, setModoNuevoEvento] = useState(false);
  const [verificandoSesion, setVerificandoSesion] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");

  const [errorEvento, setErrorEvento] = useState("");
  const [errorTipo, setErrorTipo] = useState("");
  const [errorFecha, setErrorFecha] = useState("");
  const [errorEstado, setErrorEstado] = useState("");
  const [errorCiudad, setErrorCiudad] = useState("");

  useEffect(() => {
    let activo = true;

    async function verificarSesion() {
      try {
        const supabase = createClient();
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (!activo) return;

        if (session?.user) {
          // Usuario con sesión iniciada: creará un evento adicional.
          setModoNuevoEvento(true);
          return;
        }

        // Usuario nuevo: recuperar el borrador del registro si regresa.
        setModoNuevoEvento(false);
        setEvento(localStorage.getItem("evento") || "");
        setTipoEvento(localStorage.getItem("tipoEvento") || "");
        setFecha(localStorage.getItem("fecha") || "");
        setEstado(localStorage.getItem("estado") || "");
        setCiudad(localStorage.getItem("ciudad") || "");
      } catch (error) {
        console.error("Error al verificar la sesión:", error);

        if (!activo) return;

        setErrorGeneral(
          "No pudimos verificar tu sesión. Recarga la página e inténtalo de nuevo."
        );
      } finally {
        if (activo) {
          setVerificandoSesion(false);
        }
      }
    }

    verificarSesion();

    return () => {
      activo = false;
    };
  }, []);

  async function guardarEvento() {
    if (guardando || verificandoSesion) return;

    let valido = true;

    setErrorEvento("");
    setErrorTipo("");
    setErrorFecha("");
    setErrorEstado("");
    setErrorCiudad("");
    setErrorGeneral("");

    if (!evento.trim()) {
      setErrorEvento("Ingresa el nombre del evento.");
      valido = false;
    }

    if (!tipoEvento) {
      setErrorTipo("Selecciona un tipo de evento.");
      valido = false;
    }

    if (!fecha) {
      setErrorFecha("Selecciona una fecha.");
      valido = false;
    }

    if (!estado.trim()) {
      setErrorEstado("Ingresa un estado.");
      valido = false;
    }

    if (!ciudad.trim()) {
      setErrorCiudad("Ingresa una ciudad.");
      valido = false;
    }

    if (!valido) return;

    setGuardando(true);

    try {
    
      // Flujo original para usuarios que todavía no han creado su cuenta.
      localStorage.setItem("evento", evento.trim());
      localStorage.setItem("tipoEvento", tipoEvento);
      localStorage.setItem("fecha", fecha);
      localStorage.setItem("estado", estado.trim());
      localStorage.setItem("ciudad", ciudad.trim());

      router.push("/crear-album/pago");
    } catch (error) {
      console.error("Error al guardar el evento:", error);
      setErrorGeneral("Ocurrió un error al guardar el evento. Inténtalo nuevamente.");
    } finally {
      setGuardando(false);
    }
  }

  function regresar() {
    if (modoNuevoEvento) {
      router.push("/dashboard");
      return;
    }

    localStorage.setItem("evento", evento);
    localStorage.setItem("tipoEvento", tipoEvento);
    localStorage.setItem("fecha", fecha);
    localStorage.setItem("estado", estado);
    localStorage.setItem("ciudad", ciudad);

    router.push("/crear-album/datos");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-violet-50">
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center">
          <span className="text-violet-600 font-semibold tracking-widest uppercase">
            Flashboom Fotos
          </span>

          <h1 className="text-5xl font-bold text-gray-900 mt-5">
            Tu evento
          </h1>

          <p className="text-gray-500 text-xl mt-8">
            Cuéntanos un poco sobre tu celebración.
          </p>
        </div>

        <div className="mt-12 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center">
            ✓
          </div>

          <div className="w-20 h-1 bg-violet-600" />

          <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center">
            ✓
          </div>

          <div className="w-20 h-1 bg-violet-600" />

          <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center">
            3
          </div>

          <div className="w-20 h-1 bg-gray-200" />

          <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
            4
          </div>
        </div>

        <div className="mt-16 bg-white rounded-[35px] shadow-xl border border-violet-100 p-10">
          <label className="block font-semibold mb-3">
            Nombre del evento
          </label>

          <input
            type="text"
            value={evento}
            onChange={(e) => {
              setEvento(e.target.value);
              setErrorEvento("");
            }}
            placeholder="Boda Rodrigo y Ana"
            className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
          />

          {errorEvento && (
            <p className="text-red-500 mt-2 text-sm">{errorEvento}</p>
          )}

          <div className="mt-8">
            <label className="block font-semibold mb-5">
              Tipo de evento
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { nombre: "Boda", emoji: "💒" },
                { nombre: "XV", etiqueta: "XV Años", emoji: "👑" },
                { nombre: "Cumpleaños", emoji: "🎂" },
                { nombre: "Baby Shower", emoji: "👶" },
                { nombre: "Graduación", emoji: "🎓" },
                { nombre: "Otro", emoji: "🎉" },
              ].map((tipo) => (
                <button
                  key={tipo.nombre}
                  type="button"
                  onClick={() => {
                    setTipoEvento(tipo.nombre);
                    setErrorTipo("");
                  }}
                  className={`border rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    tipoEvento === tipo.nombre
                      ? "bg-violet-600 text-white border-violet-600 scale-105"
                      : "border-violet-200 hover:bg-violet-50 hover:border-violet-500"
                  }`}
                >
                  <div className="text-3xl">{tipo.emoji}</div>
                  <div className="mt-2 font-semibold">
                    {tipo.etiqueta || tipo.nombre}
                  </div>
                </button>
              ))}
            </div>

            {errorTipo && (
              <p className="text-red-500 text-center mt-4">{errorTipo}</p>
            )}
          </div>

          <div className="mt-8">
            <label className="block font-semibold mb-3">
              Fecha del evento
            </label>

            <input
              type="date"
              value={fecha}
              onChange={(e) => {
                setFecha(e.target.value);
                setErrorFecha("");
              }}
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
            />

            {errorFecha && (
              <p className="text-red-500 mt-2 text-sm">{errorFecha}</p>
            )}
          </div>

          <div className="mt-8">
            <label className="block font-semibold mb-3">Estado</label>

            <input
              type="text"
              value={estado}
              onChange={(e) => {
                setEstado(e.target.value);
                setErrorEstado("");
              }}
              placeholder="Jalisco"
              className="w-full border border-gray-300 rounded-2xl px-5 py-4"
            />

            {errorEstado && (
              <p className="text-red-500 mt-2 text-sm">{errorEstado}</p>
            )}
          </div>

          <div className="mt-8">
            <label className="block font-semibold mb-3">Ciudad</label>

            <input
              type="text"
              value={ciudad}
              onChange={(e) => {
                setCiudad(e.target.value);
                setErrorCiudad("");
              }}
              placeholder="Guadalajara"
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
            />

            {errorCiudad && (
              <p className="text-red-500 mt-2 text-sm">{errorCiudad}</p>
            )}
          </div>

          {errorGeneral && (
            <p className="text-red-500 mt-4 text-center">{errorGeneral}</p>
          )}

          <div className="flex gap-4 mt-10">
            <button
              type="button"
              onClick={regresar}
              disabled={verificandoSesion || guardando}
              className="w-full border border-violet-300 text-violet-600 py-4 rounded-2xl disabled:opacity-50"
            >
              ← Regresar
            </button>

            <button
              type="button"
              onClick={guardarEvento}
              disabled={verificandoSesion || guardando}
              className="w-full bg-violet-600 hover:bg-violet-700 transition text-white py-4 rounded-2xl disabled:opacity-50"
            >
              {verificandoSesion
                ? "Verificando sesión..."
                : guardando
                  ? "Guardando evento..."
                  : modoNuevoEvento
                    ? "Continuar →"
                    : "Continuar →"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
