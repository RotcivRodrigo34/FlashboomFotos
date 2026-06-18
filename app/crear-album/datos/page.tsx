"use client";

import Link from "next/link";
import { useState,useEffect } from "react";
export default function Datos() {
    const [correo,setCorreo]=useState("");

const [password,setPassword]=useState("");

const [confirmar,setConfirmar]=useState("");

const [errorCorreo,setErrorCorreo]=useState("");

const [errorPassword,setErrorPassword]=useState("");

const [errorConfirmar,setErrorConfirmar]=useState("");
useEffect(()=>{

const nombre=localStorage.getItem("nombre");

const celular=localStorage.getItem("celular");

if(!nombre||!celular){

window.location.href="/crear-album";

return;

}

const correoGuardado=localStorage.getItem("correo");

const passwordGuardado=localStorage.getItem("password");

if(correoGuardado){

setCorreo(correoGuardado);

}

if(passwordGuardado){

setPassword(passwordGuardado);

setConfirmar(passwordGuardado);

}

},[]);
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

            Estamos a unos pasos
            de crear tu álbum.

          </p>

        </div>

        {/* PROGRESO */}

        <div className="mt-12">

          <div className="flex items-center justify-center">

            <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold">

              ✓

            </div>

            <div className="w-20 h-1 bg-violet-600"></div>

            <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold">

              2

            </div>

            <div className="w-20 h-1 bg-gray-200"></div>

            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">

              3

            </div>

            <div className="w-20 h-1 bg-gray-200"></div>

            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">

              4

            </div>

          </div>

        </div>

        {/* TARJETA */}

        <div className="mt-16 bg-white rounded-[35px] shadow-xl border border-violet-100 p-10">

          <div>

            <label className="block text-gray-700 font-semibold mb-3">

              Correo electrónico

            </label>

            <input

type="email"

value={correo}

onChange={(e)=>{

setCorreo(e.target.value);

setErrorCorreo("");

}}

placeholder="correo@ejemplo.com"

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

{
errorCorreo&&(

<p className="text-red-500 mt-2 text-sm">

{errorCorreo}

</p>

)
}

          </div>

          <div className="mt-8">

            <label className="block text-gray-700 font-semibold mb-3">

              Contraseña

            </label>

            <input
  type="password"
  value={password}
  onChange={(e)=>{
    setPassword(e.target.value);
    setErrorPassword("");
  }}
  placeholder="********"
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

{
errorPassword && (

<p className="text-red-500 mt-2 text-sm">

{errorPassword}

</p>

)
}

          </div>

          <div className="mt-8">

            <label className="block text-gray-700 font-semibold mb-3">

              Confirmar contraseña

            </label>

           <input
  type="password"
  value={confirmar}
  onChange={(e)=>{
    setConfirmar(e.target.value);
    setErrorConfirmar("");
  }}
  placeholder="********"
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

{
errorConfirmar && (

<p className="text-red-500 mt-2 text-sm">

{errorConfirmar}

</p>

)
}

          </div>

          <div className="flex gap-4 mt-10">

<button

onClick={()=>{

localStorage.setItem("correo",correo);

localStorage.setItem("password",password);

window.location.href="/crear-album";

}}

className="
w-full
border
border-violet-300
text-violet-600
py-4
rounded-2xl">

← Regresar

</button>

<button

onClick={()=>{

let valido=true;

if(correo.trim()==""){

setErrorCorreo("Ingresa tu correo.");

valido=false;

}

if(password.trim()==""){

setErrorPassword("Ingresa una contraseña.");

valido=false;

}

if(confirmar.trim()==""){

setErrorConfirmar("Confirma tu contraseña.");

valido=false;

}

if(password!=confirmar){

setErrorConfirmar("Las contraseñas no coinciden.");

valido=false;

}

if(!valido){

return;

}

localStorage.setItem("correo",correo);

localStorage.setItem("password",password);

window.location.href="/crear-album/evento";

}}

className="
w-full
bg-violet-600
hover:bg-violet-700
transition
text-white
py-4
rounded-2xl">

Continuar →

</button>

          </div>

        </div>

      </section>

    </main>

  );
}