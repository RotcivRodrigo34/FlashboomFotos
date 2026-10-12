
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Datos() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmar, setErrorConfirmar] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [verificando, setVerificando] = useState(true);
  const [sesionActiva, setSesionActiva] = useState(false);

  useEffect(() => {
    let cancelado = false;

    async function comprobarSesion() {
      const supabase = createClient();

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (cancelado) return;

      if (error || !user) {
        setSesionActiva(false);
        setVerificando(false);
        return;
      }

      setSesionActiva(true);
      setCorreo(user.email ?? "");
      setVerificando(false);

      // Si ya existe una sesión, no necesitamos registrar otra cuenta.
      // Continuamos directamente con los datos del evento.
      window.location.replace("/crear-album/evento");
    }

    comprobarSesion();

    return () => {
      cancelado = true;
    };
  }, []);

  async function continuar() {
    if (procesando) return;

    setErrorCorreo("");
    setErrorPassword("");
    setErrorConfirmar("");

    const correoNormalizado = correo.trim().toLowerCase();
    let valido = true;

    if (
      !correoNormalizado ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoNormalizado)
    ) {
      setErrorCorreo("Ingresa un correo electrónico válido.");
      valido = false;
    }

    if (password.length < 8) {
      setErrorPassword("La contraseña debe tener al menos 8 caracteres.");
      valido = false;
    }

    if (!confirmar) {
      setErrorConfirmar("Confirma tu contraseña.");
      valido = false;
    } else if (password !== confirmar) {
      setErrorConfirmar("Las contraseñas no coinciden.");
      valido = false;
    }

    if (!valido) return;

    const nombre = localStorage.getItem("nombre") || "";
    const celular = localStorage.getItem("celular") || "";

    if (!nombre || !celular) {
      window.location.href = "/crear-album";
      return;
    }

    setProcesando(true);

    try {
      const respuesta = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          celular,
          correo: correoNormalizado,
          password,
        }),
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        setErrorCorreo(resultado.error || "No se pudo crear la cuenta.");
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
        error: errorSesion,
      } = await supabase.auth.getUser();

      if (errorSesion || !user) {
        setErrorCorreo(
          "La cuenta se creó, pero no se confirmó la sesión. Inicia sesión."
        );
        return;
      }

      localStorage.removeItem("password");
      localStorage.setItem("correo", correoNormalizado);
      window.location.href = "/crear-album/evento";
    } catch {
      setErrorCorreo("No se pudo completar el registro. Intenta nuevamente.");
    } finally {
      setProcesando(false);
    }
  }

  if (verificando) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-violet-50">
        <p className="text-violet-700">Verificando tu sesión...</p>
      </main>
    );
  }

  if (sesionActiva) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-violet-50">
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center">
          <span className="text-violet-600 font-semibold tracking-widest uppercase">
            Flashboom Fotos
          </span>
          <h1 className="text-5xl font-bold text-gray-900 mt-5">Tus datos</h1>
          <p className="text-gray-500 text-xl mt-8">
            Estamos a unos pasos de crear tu álbum.
          </p>
        </div>

        <div className="mt-12 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center">✓</div>
          <div className="w-20 h-1 bg-violet-600" />
          <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center">2</div>
          <div className="w-20 h-1 bg-gray-200" />
          <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">3</div>
          <div className="w-20 h-1 bg-gray-200" />
          <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">4</div>
        </div>

        <div className="mt-16 bg-white rounded-[35px] shadow-xl border border-violet-100 p-10">
          <label className="block text-gray-700 font-semibold mb-3">
            Correo electrónico
          </label>
          <input
            type="email"
            value={correo}
            onChange={(e) => {
              setCorreo(e.target.value);
              setErrorCorreo("");
            }}
            placeholder="correo@ejemplo.com"
            autoComplete="email"
            className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
          />
          {errorCorreo && <p className="text-red-500 mt-2 text-sm">{errorCorreo}</p>}

          <div className="mt-8">
            <label className="block text-gray-700 font-semibold mb-3">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorPassword("");
              }}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
            />
            {errorPassword && <p className="text-red-500 mt-2 text-sm">{errorPassword}</p>}
          </div>

          <div className="mt-8">
            <label className="block text-gray-700 font-semibold mb-3">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirmar}
              onChange={(e) => {
                setConfirmar(e.target.value);
                setErrorConfirmar("");
              }}
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
            />
            {errorConfirmar && <p className="text-red-500 mt-2 text-sm">{errorConfirmar}</p>}
          </div>

          <div className="flex gap-4 mt-10">
            <Link
              href="/crear-album"
              className="w-full border border-violet-300 text-violet-600 py-4 rounded-2xl text-center"
            >
              ← Regresar
            </Link>
            <button
              type="button"
              disabled={procesando}
              onClick={continuar}
              className="w-full bg-violet-600 hover:bg-violet-700 transition text-white py-4 rounded-2xl disabled:opacity-60"
            >
              {procesando ? "Creando cuenta..." : "Continuar →"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
