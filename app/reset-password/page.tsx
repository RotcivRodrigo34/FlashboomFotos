"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [mensaje,setMensaje]=useState("Validando token...");
  const [valido,setValido]=useState(false);
  const [password,setPassword]=useState("");
  const [confirmar,setConfirmar]=useState("");
  const [mensajePassword,setMensajePassword]=useState("");
  useEffect(()=>{

  async function validar(){

    if(!token){

      setMensaje("Token no encontrado.");

      return;

    }

    const {data,error}=await supabase
    .from("password_reset")
    .select()
    .eq("token",token)
    .eq("usado",false);

    if(error){

      setMensaje(error.message);

      return;

    }

 if(data.length===0){

  setMensaje("Token inválido.");

  return;

}

const fechaActual=new Date();

const fechaExpira=new Date(data[0].expira);

if(fechaActual>fechaExpira){

  setMensaje("El enlace ha expirado.");

  return;

}

setMensaje("Token válido.");
setValido(true);

  }

  validar();

},[token]);
async function guardarPassword(){

  setMensajePassword("");

  if(password!==confirmar){

    setMensajePassword(
      "Las contraseñas no coinciden."
    );

    return;

  }

  if(password.length<6){

    setMensajePassword(
      "La contraseña debe tener al menos 6 caracteres."
    );

    return;

  }

const { data, error } = await supabase
  .from("password_reset")
  .select()
  .eq("token", token);

if (error) {
  setMensajePassword(error.message);
  return;
}

if (!data || data.length === 0) {
  setMensajePassword("Token inválido.");
  return;
}

  if (data.length === 0) {
    setMensajePassword("Token inválido.");
    return;
  }

  const usuarioID = data[0].usuario_id;

  const { error: errorPassword } = await supabase
    .from("usuarios")
    .update({
      password: password
    })
    .eq("id", usuarioID);

  if (errorPassword) {
    setMensajePassword(errorPassword.message);
    return;
  }

  const { error: errorToken } = await supabase
    .from("password_reset")
    .update({
      usado: true
    })
    .eq("token", token);

 if (errorToken) {
  console.log(errorToken);
  setMensajePassword(JSON.stringify(errorToken));
  return;
}

setMensajePassword(
  "Contraseña actualizada correctamente. Redirigiendo..."
);

setValido(false);

setPassword("");

setConfirmar("");

setTimeout(()=>{

  window.location.href="/login";

},3000);

}
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-violet-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[35px] shadow-2xl border border-violet-100 p-10">

        <div className="text-center">
          <span className="text-violet-600 font-semibold tracking-widest uppercase">
            Flashboom Fotos
          </span>

          <h1 className="text-4xl font-bold mt-5">
            Restablecer contraseña
          </h1>

          <p className="text-gray-500 mt-5">
            Estamos validando tu solicitud.
          </p>
        </div>

        <div className="mt-10">

          <p className="font-semibold">
             Estado:
          </p>

         <div className="mt-3 break-all rounded-2xl bg-gray-100 p-4 text-sm">
            {mensaje}
         </div>

        </div>
        {
  valido && (

    <div className="mt-8">

      <label className="block font-semibold mb-3">
        Nueva contraseña
      </label>

      <input
        type="password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        className="
        w-full
        border
        border-gray-300
        rounded-2xl
        px-5
        py-4
        focus:outline-none
        focus:border-violet-500"
      />

      <label className="block font-semibold mb-3 mt-6">
        Confirmar contraseña
      </label>

      <input
        type="password"
        value={confirmar}
        onChange={(e)=>setConfirmar(e.target.value)}
        className="
        w-full
        border
        border-gray-300
        rounded-2xl
        px-5
        py-4
        focus:outline-none
        focus:border-violet-500"
      />

<button
  onClick={guardarPassword}
  className="
  w-full
  mt-8
  bg-violet-600
  hover:bg-violet-700
  transition
  text-white
  py-4
  rounded-2xl"
>
  Guardar nueva contraseña
</button>
{
  mensajePassword && (

  <p className="text-center mt-4 text-red-500 font-medium">
  {mensajePassword}
</p>

  )
}

    </div>

  )
}

        <div className="text-center mt-8">
          <Link
            href="/login"
            className="text-violet-600 hover:underline"
          >
            Volver al inicio de sesión
          </Link>
        </div>

      </div>
    </main>
  );
}