"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type RegistroTemporal = {
  password: string;
};

type WindowConRegistro = Window & {
  __flashboomRegistroTemporal?: RegistroTemporal;
};

function obtenerRegistroTemporal(): RegistroTemporal {
  const ventana = window as WindowConRegistro;

  if (!ventana.__flashboomRegistroTemporal) {
    ventana.__flashboomRegistroTemporal = {
      password: "",
    };
  }

  return ventana.__flashboomRegistroTemporal;
}

export default function Datos() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmar, setErrorConfirmar] = useState("");

  const [procesando] = useState(false);

  useEffect(() => {
    const correoGuardado = localStorage.getItem("correo") || "";
    setCorreo(correoGuardado);

    // Recuperar la contraseña de la memoria temporal del navegador.
    const registro = obtenerRegistroTemporal();
    setPassword(registro.password);
    setConfirmar(registro.password);
  }, []);

  function continuar() {
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
      setErrorPassword(
        "La contraseña debe tener al menos 8 caracteres."
      );
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
      router.push("/crear-album");
      return;
    }

    localStorage.setItem("correo", correoNormalizado);

    // Mantener la contraseña únicamente en memoria.
    obtenerRegistroTemporal().password = password;

    router.push("/crear-album/evento");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-violet-50">
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center">
          <span className="text-violet-600 font-semibold tracking-widest uppercase">
            Flashboom Fotos
          </span>

          <h1 className="text-5xl font-bold text-gray-900 mt-5">
            Tus datos
          </h1>

          <p className="text-gray-500 text-xl mt-8">
            Estamos a unos pasos de crear tu álbum.
          </p>
        </div>

        <div className="mt-12 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center">
            ✓
          </div>

          <div className="w-20 h-1 bg-violet-600" />

          <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center">
            2
          </div>

          <div className="w-20 h-1 bg-gray-200" />

          <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
            3
          </div>

          <div className="w-20 h-1 bg-gray-200" />

          <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
            4
          </div>
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

          {errorCorreo && (
            <p className="text-red-500 mt-2 text-sm">
              {errorCorreo}
            </p>
          )}

          <div className="mt-8">
            <label className="block text-gray-700 font-semibold mb-3">
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                obtenerRegistroTemporal().password = e.target.value;
                setErrorPassword("");
              }}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
            />

            {errorPassword && (
              <p className="text-red-500 mt-2 text-sm">
                {errorPassword}
              </p>
            )}
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

            {errorConfirmar && (
              <p className="text-red-500 mt-2 text-sm">
                {errorConfirmar}
              </p>
            )}
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
              Continuar →
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}