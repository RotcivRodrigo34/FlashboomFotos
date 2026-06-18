"use client";

import Link from "next/link";
import { useState,useEffect } from "react";
export default function Pago() {
    const [nombre,setNombre]=useState("");

const [celular,setCelular]=useState("");

const [correo,setCorreo]=useState("");

const [evento,setEvento]=useState("");

const [tipoEvento,setTipoEvento]=useState("");

const [fecha,setFecha]=useState("");

const [estado,setEstado]=useState("");

const [ciudad,setCiudad]=useState("");
useEffect(()=>{

const nombreLS=localStorage.getItem("nombre");

const celularLS=localStorage.getItem("celular");

const correoLS=localStorage.getItem("correo");

const eventoLS=localStorage.getItem("evento");

const tipoLS=localStorage.getItem("tipoEvento");

const fechaLS=localStorage.getItem("fecha");

const estadoLS=localStorage.getItem("estado");

const ciudadLS=localStorage.getItem("ciudad");

if(

!nombreLS||

!celularLS||

!correoLS||

!eventoLS||

!tipoLS||

!fechaLS||

!estadoLS||

!ciudadLS

){

window.location.href="/crear-album";

return;

}

setNombre(nombreLS);

setCelular(celularLS);

setCorreo(correoLS);

setEvento(eventoLS);

setTipoEvento(tipoLS);

setFecha(fechaLS);

setEstado(estadoLS);

setCiudad(ciudadLS);

},[]);
  return (

    <main className="min-h-screen bg-gradient-to-b from-white to-violet-50">

      <section className="max-w-4xl mx-auto px-6 py-20">

        <div className="text-center">

          <span className="text-violet-600 font-semibold tracking-widest uppercase">

            Flashboom Fotos

          </span>

          <h1 className="text-5xl font-bold mt-5">

            Confirmar y pagar

          </h1>

          <p className="text-gray-500 text-xl mt-8">

            Revisa tu información antes de continuar.

          </p>

        </div>

        <div className="mt-12 flex items-center justify-center">

          <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center">

            ✓

          </div>

          <div className="w-20 h-1 bg-violet-600"></div>

          <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center">

            ✓

          </div>

          <div className="w-20 h-1 bg-violet-600"></div>

          <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center">

            ✓

          </div>

          <div className="w-20 h-1 bg-violet-600"></div>

          <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center">

            4

          </div>

        </div>

       
<div className="mt-10">

<div
className="
max-w-3xl
mx-auto
bg-white
rounded-[30px]
border
border-violet-200
shadow-xl
hover:shadow-violet-200/60
hover:shadow-2xl
transition-all
duration-500
overflow-hidden">

<div className="
bg-gradient-to-r
from-violet-600
to-violet-700
text-white
text-center
py-6">

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

<p className="text-gray-400 text-sm">

Nombre

</p>

<p className="font-semibold text-lg">

{nombre}

</p>

</div>

<div>

<p className="text-gray-400 text-sm">

Teléfono

</p>

<p className="font-semibold text-lg">

{celular}

</p>

</div>

</div>

<div className="mt-6">

<p className="text-gray-400 text-sm">

Correo

</p>

<p className="font-semibold text-lg break-all">

{correo}

</p>

</div>

<hr className="my-8 border-violet-100"/>

<div className="grid md:grid-cols-2 gap-6">

<div>

<p className="text-gray-400 text-sm">

Evento

</p>

<p className="font-semibold text-lg">

{evento}

</p>

</div>

<div>

<p className="text-gray-400 text-sm">

Tipo

</p>

<p className="font-semibold text-lg">

{tipoEvento}

</p>

</div>

</div>

<div className="mt-6">

<p className="text-gray-400 text-sm">

Fecha

</p>

<p className="font-semibold text-lg">

{fecha}

</p>

</div>

<div className="mt-6">

<p className="text-gray-400 text-sm">

Ubicación

</p>

<p className="font-semibold text-lg">

{ciudad}, {estado}

</p>

</div>

<hr className="my-8 border-violet-100"/>

<div className="text-center">

<p className="text-gray-500">

Plan Flashboom Fotos

</p>

<p className="text-5xl font-black text-violet-600 mt-3">

$299.00

</p>

</div>

</div>

</div>

</div>

          <p className="mt-8 text-center text-gray-500">

            Tu evento será creado después de confirmar tu pago.

          </p>

          <div className="flex gap-4 mt-10">

            <Link
            href="/crear-album/evento"
            className="w-full border border-violet-300 text-violet-600 py-4 rounded-2xl text-center">

              ← Regresar

            </Link>

            <Link
            href="/crear-album/pago"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-2xl text-center">

              Pagar $299 →

            </Link>

          </div>
        

      </section>

    </main>

  );
}