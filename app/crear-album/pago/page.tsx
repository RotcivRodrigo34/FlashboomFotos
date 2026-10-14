"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type RegistroTemporal = {
  password: string;
};

type WindowConRegistro = Window & {
  __flashboomRegistroTemporal?: RegistroTemporal;
};

function obtenerRegistroTemporal(): RegistroTemporal {
  const ventana = window as WindowConRegistro;

  if (!ventana.__flashboomRegistroTemporal) {
    ventana.__flashboomRegistroTemporal = { password: "" };
  }

  return ventana.__flashboomRegistroTemporal;
}

export default function Pago() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [celular, setCelular] = useState("");
  const [correo, setCorreo] = useState("");
  const [evento, setEvento] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [fecha, setFecha] = useState("");
  const [estado, setEstado] = useState("");
  const [ciudad, setCiudad] = useState("");

  const [modoNuevoEvento, setModoNuevoEvento] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargarDatos() {
      try {
        const supabase = createClient();
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;
        if (!activo) return;

        const eventoLS = localStorage.getItem("evento") || "";
        const tipoLS = localStorage.getItem("tipoEvento") || "";
        const fechaLS = localStorage.getItem("fecha") || "";
        const estadoLS = localStorage.getItem("estado") || "";
        const ciudadLS = localStorage.getItem("ciudad") || "";

        if (!eventoLS || !tipoLS || !fechaLS || !estadoLS || !ciudadLS) {
          router.replace("/crear-album/evento");
          return;
        }

        setEvento(eventoLS);
        setTipoEvento(tipoLS);
        setFecha(fechaLS);
        setEstado(estadoLS);
        setCiudad(ciudadLS);

        if (session?.user) {
          // Usuario con sesión: se creará un evento adicional después de confirmar.
          setModoNuevoEvento(true);
        } else {
          // Registro de usuario nuevo: requiere los datos personales.
          const nombreLS = localStorage.getItem("nombre") || "";
          const celularLS = localStorage.getItem("celular") || "";
          const correoLS = localStorage.getItem("correo") || "";

          if (!nombreLS || !celularLS || !correoLS) {
            router.replace("/crear-album/datos");
            return;
          }

          setNombre(nombreLS);
          setCelular(celularLS);
          setCorreo(correoLS);
          setModoNuevoEvento(false);
        }
      } catch (error) {
        console.error("Error al cargar los datos de pago:", error);
        if (activo) {
          setMensaje(
            "No pudimos verificar tu sesión. Recarga la página e inténtalo de nuevo."
          );
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarDatos();

    return () => {
      activo = false;
    };
  }, [router]);

  async function confirmarPromocion() {
    if (procesando) return;

    setMensaje("");
    setProcesando(true);

    try {
      if (modoNuevoEvento) {
        // La cuenta ya existe. Crear el evento solamente al confirmar aquí.
        const respuesta = await fetch("/api/crear-evento", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            evento: evento.trim(),
            tipoEvento,
            fecha,
            estado: estado.trim(),
            ciudad: ciudad.trim(),
          }),
        });

        const resultado = await respuesta.json().catch(() => null);

        if (!respuesta.ok) {
          setMensaje(
            resultado?.error ||
              "No fue posible crear el evento. Intenta nuevamente."
          );
          return;
        }

        [
          "evento",
          "tipoEvento",
          "fecha",
          "estado",
          "ciudad",
        ].forEach((clave) => localStorage.removeItem(clave));

        router.replace("/dashboard");
        router.refresh();
        return;
      }

      // Registro inicial: la contraseña temporal solo se usa en este flujo.
      const password = obtenerRegistroTemporal().password;

      if (!password || password.length < 8) {
        setMensaje(
          "No se encontró tu contraseña temporal. Regresa al paso Tus datos y vuelve a ingresarla."
        );
        return;
      }

      const respuesta = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          celular: celular.trim(),
          correo: correo.trim().toLowerCase(),
          password,
          evento: evento.trim(),
          tipoEvento,
          fecha,
          estado: estado.trim(),
          ciudad: ciudad.trim(),
          estatus: "ACTIVO",
          promocion: true,
        }),
      });

      const resultado = await respuesta.json().catch(() => null);

      if (!respuesta.ok) {
        if (resultado?.codigo === "CUENTA_EXISTENTE") {
          setMensaje(
            "Este correo ya tiene una cuenta. Inicia sesión para continuar."
          );
        } else if (resultado?.codigo === "INICIO_SESION_MANUAL") {
          setMensaje(
            "Tu cuenta y tu evento fueron creados, pero no se pudo iniciar sesión automáticamente. Ve a Iniciar sesión para continuar."
          );
        } else {
          setMensaje(
            resultado?.error ||
              "No fue posible activar la promoción. Intenta nuevamente."
          );
        }
        return;
      }

      [
        "nombre",
        "correo",
        "celular",
        "evento",
        "tipoEvento",
        "fecha",
        "estado",
        "ciudad",
      ].forEach((clave) => localStorage.removeItem(clave));

      obtenerRegistroTemporal().password = "";
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error al confirmar la promoción:", error);
      setMensaje("Ocurrió un error de conexión. Intenta nuevamente.");
    } finally {
      setProcesando(false);
    }
  }

  if (cargando) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-violet-50 flex items-center justify-center">
        <p className="text-violet-700">Cargando información del evento...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-violet-50">
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center">
          <span className="text-violet-600 font-semibold tracking-widest uppercase">
            Flashboom Fotos
          </span>

          <h1 className="text-5xl font-bold mt-5">
            {modoNuevoEvento ? "Confirmar nuevo evento" : "Confirmar promoción"}
          </h1>

          <p className="text-gray-500 text-xl mt-8">
            Revisa los datos de tu evento antes de activarlo.
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
            ✓
          </div>
          <div className="w-20 h-1 bg-violet-600" />
          <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center">
            4
          </div>
        </div>

        <div className="mt-10">
          <div className="max-w-3xl mx-auto bg-white rounded-[30px] border border-violet-200 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-violet-700 text-white text-center py-6">
              <h2 className="text-3xl font-bold">FLASHBOOM FOTOS</h2>
              <p className="tracking-[5px] uppercase text-violet-200 mt-2">
                Tu Evento
              </p>
            </div>

            <div className="p-8">
              {!modoNuevoEvento && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-400 text-sm">Nombre</p>
                      <p className="font-semibold text-lg">{nombre}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Teléfono</p>
                      <p className="font-semibold text-lg">{celular}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-gray-400 text-sm">Correo</p>
                    <p className="font-semibold text-lg break-all">{correo}</p>
                  </div>

                  <hr className="my-8 border-violet-100" />
                </>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-sm">Evento</p>
                  <p className="font-semibold text-lg">{evento}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Tipo</p>
                  <p className="font-semibold text-lg">{tipoEvento}</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-gray-400 text-sm">Fecha</p>
                <p className="font-semibold text-lg">{fecha}</p>
              </div>

              <div className="mt-6">
                <p className="text-gray-400 text-sm">Ubicación</p>
                <p className="font-semibold text-lg">
                  {ciudad}, {estado}
                </p>
              </div>

              <hr className="my-8 border-violet-100" />

              <div className="text-center">
                <p className="text-gray-500">Precio habitual</p>
                <p className="text-xl text-gray-400 line-through mt-2">
                  $299.00 MXN
                </p>

                <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-violet-600">
                  Promoción de pruebas
                </p>

                <p className="text-5xl font-black text-violet-600 mt-3">
                  $0 MXN
                </p>

                <p className="text-gray-500 mt-3">
                  Sin cobro durante esta etapa de pruebas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {mensaje && (
          <div
            role="alert"
            className="mt-6 rounded-xl bg-red-50 p-4 text-center text-red-700"
          >
            <p>{mensaje}</p>

            {(mensaje.includes("ya tiene una cuenta") ||
              mensaje.includes("iniciar sesión")) && (
              <Link
                href="/login"
                className="inline-block mt-3 font-semibold text-violet-700 underline"
              >
                Ir a iniciar sesión
              </Link>
            )}

            {mensaje.includes("contraseña temporal") && (
              <Link
                href="/crear-album/datos"
                className="inline-block mt-3 font-semibold text-violet-700 underline"
              >
                Regresar a Tus datos
              </Link>
            )}
          </div>
        )}

        <p className="mt-8 text-center text-gray-500">
          {modoNuevoEvento
            ? "Al confirmar, se guardará este evento en tu cuenta."
            : "Al confirmar, se creará tu cuenta y tu evento promocional."}
        </p>

        <div className="flex gap-4 mt-10">
          <Link
            href="/crear-album/evento"
            className="w-full border border-violet-300 text-violet-600 py-4 rounded-2xl text-center"
          >
            ← Regresar
          </Link>

          <button
            type="button"
            onClick={confirmarPromocion}
            disabled={procesando}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white py-4 rounded-2xl text-center"
          >
            {procesando
              ? "Procesando..."
              : modoNuevoEvento
                ? "Confirmar evento gratuito →"
                : "Activar promoción gratuita →"}
          </button>
        </div>
      </section>
    </main>
  );
}
