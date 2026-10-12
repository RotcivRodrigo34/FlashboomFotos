
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Pago() {
  const [nombre, setNombre] = useState("");
  const [celular, setCelular] = useState("");
  const [correo, setCorreo] = useState("");
  const [evento, setEvento] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [fecha, setFecha] = useState("");
  const [estado, setEstado] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargarDatos() {
      const supabase = createClient();

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        window.location.replace("/login");
        return;
      }

      const nombreLS = localStorage.getItem("nombre") || "";
      const celularLS = localStorage.getItem("celular") || "";
      const correoLS = localStorage.getItem("correo") || "";
      const eventoLS = localStorage.getItem("evento") || "";
      const tipoLS = localStorage.getItem("tipoEvento") || "";
      const fechaLS = localStorage.getItem("fecha") || "";
      const estadoLS = localStorage.getItem("estado") || "";
      const ciudadLS = localStorage.getItem("ciudad") || "";

      if (
        !nombreLS ||
        !celularLS ||
        !eventoLS ||
        !tipoLS ||
        !fechaLS ||
        !estadoLS ||
        !ciudadLS
      ) {
        window.location.replace("/crear-album/evento");
        return;
      }

      if (activo) {
        setNombre(nombreLS);
        setCelular(celularLS);
        setCorreo(user.email || correoLS);
        setEvento(eventoLS);
        setTipoEvento(tipoLS);
        setFecha(fechaLS);
        setEstado(estadoLS);
        setCiudad(ciudadLS);
        setCargando(false);
      }
    }

    cargarDatos();

    return () => {
      activo = false;
    };
  }, []);

  async function confirmarPromocion() {
    if (procesando) return;

    setMensaje("");
    setProcesando(true);

    try {
      const supabase = createClient();

      // Validar la sesión actual
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        window.location.replace("/login");
        return;
      }

      // Obtener el perfil asociado a la cuenta autenticada
      const { data: perfil, error: perfilError } = await supabase
        .from("usuarios")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (perfilError || !perfil) {
        setMensaje(
          "No encontramos el perfil de tu cuenta. Cierra sesión e inicia nuevamente."
        );
        return;
      }

      // Crear el evento como promoción gratuita de pruebas
      const { data: eventoCreado, error: eventoError } = await supabase
        .from("eventos")
        .insert({
          usuario_id: perfil.id,
          nombre_evento: evento.trim(),
          tipo_evento: tipoEvento,
          fecha,
          estado,
          ciudad: ciudad.trim(),
          estatus: "ACTIVO",
          promocion: true,
        })
        .select("id, codigo")
        .single();

      if (eventoError || !eventoCreado) {
        console.error("Error al crear evento:", eventoError);
        setMensaje(
          "No fue posible crear el evento. Verifica los permisos e inténtalo nuevamente."
        );
        return;
      }

      // Limpiar los datos temporales tras crear el evento
      [
        "nombre",
        "correo",
        "celular",
        "password",
        "evento",
        "tipoEvento",
        "fecha",
        "estado",
        "ciudad",
      ].forEach((clave) => localStorage.removeItem(clave));

      // Ir al dashboard
      window.location.replace("/dashboard");
    } catch (error) {
      console.error("Error al activar la promoción:", error);
      setMensaje("Ocurrió un error inesperado. Intenta nuevamente.");
    } finally {
      setProcesando(false);
    }
  }

  if (cargando) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-violet-50 flex items-center justify-center">
        <p className="text-violet-700">Verificando tu sesión...</p>
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
            Confirmar promoción
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
              <h2 className="text-3xl font-bold">
                FLASHBOOM FOTOS
              </h2>
              <p className="tracking-[5px] uppercase text-violet-200 mt-2">
                Tu Evento
              </p>
            </div>

            <div className="p-8">
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
                <p className="font-semibold text-lg break-all">
                  {correo}
                </p>
              </div>

              <hr className="my-8 border-violet-100" />

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
          <p className="mt-6 rounded-xl bg-red-50 p-4 text-center text-red-700">
            {mensaje}
          </p>
        )}

        <p className="mt-8 text-center text-gray-500">
          Al confirmar, se creará tu evento promocional.
        </p>

        <div className="flex gap-4 mt-10">
          <Link
            href="/crear-album/evento"
            className="w-full border border-violet-300 text-violet-600 py-4 rounded-2xl text-center"
          >
            ← Regresar
          </Link>

          <button
            onClick={confirmarPromocion}
            disabled={procesando}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white py-4 rounded-2xl text-center"
          >
            {procesando
              ? "Activando promoción..."
              : "Activar promoción gratuita →"}
          </button>
        </div>
      </section>
    </main>
  );
}
