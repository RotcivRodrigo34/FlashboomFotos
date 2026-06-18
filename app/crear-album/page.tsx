"use client";

import Link from "next/link";
import { useState,useEffect } from "react";
export default function CrearAlbum() {

const [nombre,setNombre]=useState("");

const [celular,setCelular]=useState("");

const [errorNombre,setErrorNombre]=useState("");

const [errorCelular,setErrorCelular]=useState("");
useEffect(()=>{

const nombreGuardado=localStorage.getItem("nombre");

const celularGuardado=localStorage.getItem("celular");

if(nombreGuardado){

setNombre(nombreGuardado);

}

if(celularGuardado){

setCelular(celularGuardado);

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

            Tu evento comienza aquí

          </h1>

          <p className="text-gray-500 text-xl mt-8">

            Comparte momentos inolvidables
            con todos tus invitados.

          </p>
<div className="mt-12">

  <div className="flex items-center justify-center">

    <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold">

      1

    </div>

    <div className="w-20 h-1 bg-violet-300"></div>

    <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">

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

  <div className="flex justify-center gap-10 mt-4 text-sm">

    <span className="text-violet-600 font-semibold">

      Verificar

    </span>

    <span className="text-gray-400">

      Tus Datos

    </span>

    <span className="text-gray-400">

      Tu Evento

    </span>

    <span className="text-gray-400">

      Finalizar

    </span>

  </div>

</div>
        </div>

        <div className="mt-16 bg-white rounded-[35px] shadow-xl border border-violet-100 p-10">

          <div className="text-center">

            <span className="bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold">

              ⭐ Plan Único

            </span>

            <h2 className="text-3xl font-bold mt-6">

              Flashboom Fotos

            </h2>

            <div className="mt-5">

              <span className="text-5xl font-black text-violet-600">

                $299

              </span>

              <p className="text-gray-500 mt-2">

                Pago único por evento

              </p>

            </div>

          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-5">

            <div>📸 Fotos ilimitadas*</div>

            <div>🎥 Videos ilimitados*</div>

            <div>👥 Invitados ilimitados</div>

            <div>📱 Código QR personalizado</div>

            <div>🔒 Álbum privado</div>

            <div>☁️ Google Drive integrado</div>

          </div>

        <div className="mt-12">

  <label className="block text-gray-700 font-semibold mb-3">

   ¿Cómo te llamas?

  </label>

  <input

type="text"

value={nombre}

onChange={(e)=>{

setNombre(e.target.value);

setErrorNombre("");

}}

placeholder="Escribe tu nombre"

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
errorNombre&&(

<p className="text-red-500 mt-2 text-sm">

{errorNombre}

</p>

)
}

</div>

<div className="mt-8">

  <label className="block text-gray-700 font-semibold mb-3">

   ¿Cuál es tu celular?

  </label>

  <div className="flex">

    <div className="bg-gray-100 px-5 flex items-center rounded-l-2xl border border-r-0 border-gray-300">

      +52

    </div>

  <input

type="tel"
maxLength={10}

value={celular}

onChange={(e)=>{

setCelular(e.target.value);

setErrorCelular("");

}}

placeholder="3312345678"

className="
w-full
border
border-gray-300
rounded-r-2xl
px-5
py-4
focus:outline-none
focus:border-violet-500"
/>
{
errorCelular&&(

<p className="text-red-500 mt-2 text-sm">

{errorCelular}

</p>

)
}

  </div>

</div>

<button

onClick={()=>{

let valido=true;

if(nombre.trim()==""){

setErrorNombre("Ingresa tu nombre.");

valido=false;

}

if(celular.trim()==""){

setErrorCelular("Ingresa tu celular.");

valido=false;

}

else if(celular.length!=10){

setErrorCelular("El celular debe tener 10 dígitos.");

valido=false;

}

if(!valido)return;

localStorage.setItem("nombre",nombre);

localStorage.setItem("celular",celular);

window.location.href="/crear-album/datos";

}}

className="
w-full
mt-10
bg-violet-600
hover:bg-violet-700
transition
text-white
py-4
rounded-2xl
text-lg
font-semibold">

Continuar →

</button>

          <p className="text-center text-gray-400 text-sm mt-6">

            Al continuar aceptas nuestros términos y condiciones.

          </p>

          <p className="text-center text-gray-300 text-xs mt-4">

            *Sujeto al espacio disponible
            en tu cuenta de Google.

          </p>

        </div>

      </section>

    </main>
  );
}