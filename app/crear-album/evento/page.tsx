"use client";

import Link from "next/link";
import { useState,useEffect } from "react";
export default function Evento() {
   const [evento,setEvento]=useState("");

const [tipoEvento,setTipoEvento]=useState("");

const [fecha,setFecha]=useState("");

const [estado,setEstado]=useState("");

const [ciudad,setCiudad]=useState("");

const [errorEvento,setErrorEvento]=useState("");

const [errorTipo,setErrorTipo]=useState("");

const [errorFecha,setErrorFecha]=useState("");

const [errorEstado,setErrorEstado]=useState("");

const [errorCiudad,setErrorCiudad]=useState("");
useEffect(()=>{

const nombre=localStorage.getItem("nombre");

const celular=localStorage.getItem("celular");

const correo=localStorage.getItem("correo");

const password=localStorage.getItem("password");

if(

!nombre||

!celular||

!correo||

!password

){

window.location.href="/crear-album";

return;

}

const eventoGuardado=localStorage.getItem("evento");

const tipoGuardado=localStorage.getItem("tipoEvento");

const fechaGuardada=localStorage.getItem("fecha");

const estadoGuardado=localStorage.getItem("estado");

const ciudadGuardada=localStorage.getItem("ciudad");

if(eventoGuardado)setEvento(eventoGuardado);

if(tipoGuardado)setTipoEvento(tipoGuardado);

if(fechaGuardada)setFecha(fechaGuardada);

if(estadoGuardado)setEstado(estadoGuardado);

if(ciudadGuardada)setCiudad(ciudadGuardada);

},[]);
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

          <div className="w-20 h-1 bg-violet-600"></div>

          <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center">

            ✓

          </div>

          <div className="w-20 h-1 bg-violet-600"></div>

          <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center">

            3

          </div>

          <div className="w-20 h-1 bg-gray-200"></div>

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
  errorEvento && (

    <p className="text-red-500 mt-2 text-sm">

      {errorEvento}

    </p>

  )
}

      <div className="mt-8">

  <label className="block font-semibold mb-5">

    Tipo de evento

  </label>

  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

  <div
onClick={() => {

setTipoEvento("Boda");

setErrorTipo("");

}}
className={`
border
rounded-2xl
p-4
text-center
cursor-pointer
transition-all
duration-300
hover:shadow-lg
${
tipoEvento==="Boda"
? "bg-violet-600 text-white border-violet-600 scale-105"
: "border-violet-200 hover:bg-violet-50 hover:border-violet-500"
}
`}>

<div className="text-3xl">

💒

</div>

<div className="mt-2 font-semibold">

Boda

</div>

</div>
<div
onClick={() => {

setTipoEvento("XV");

setErrorTipo("");

}}
className={`
border
rounded-2xl
p-4
text-center
cursor-pointer
transition-all
duration-300
hover:shadow-lg
${
tipoEvento==="XV"
? "bg-violet-600 text-white border-violet-600 scale-105"
: "border-violet-200 hover:bg-violet-50 hover:border-violet-500"
}
`}>

<div className="text-3xl">

👑

</div>

<div className="mt-2 font-semibold">

XV Años

</div>

</div>

<div
onClick={() => {

setTipoEvento("Cumpleaños");

setErrorTipo("");

}}
className={`
border
rounded-2xl
p-4
text-center
cursor-pointer
transition-all
duration-300
hover:shadow-lg
${
tipoEvento==="cumpleaños"
? "bg-violet-600 text-white border-violet-600 scale-105"
: "border-violet-200 hover:bg-violet-50 hover:border-violet-500"
}
`}>

<div className="text-3xl">

🎂

</div>

<div className="mt-2 font-semibold">

Cumpleaños

</div>

</div>
  <div
onClick={() => {

setTipoEvento("Baby Shower");

setErrorTipo("");

}}
className={`
border
rounded-2xl
p-4
text-center
cursor-pointer
transition-all
duration-300
hover:shadow-lg
${
tipoEvento==="Baby Shower"
? "bg-violet-600 text-white border-violet-600 scale-105"
: "border-violet-200 hover:bg-violet-50 hover:border-violet-500"
}
`}>

<div className="text-3xl">

👶

</div>

<div className="mt-2 font-semibold">

Baby Shower

</div>

</div>

<div
onClick={() => {

setTipoEvento("Graduación");

setErrorTipo("");

}}
className={`
border
rounded-2xl
p-4
text-center
cursor-pointer
transition-all
duration-300
hover:shadow-lg
${
tipoEvento==="Graduacion"
? "bg-violet-600 text-white border-violet-600 scale-105"
: "border-violet-200 hover:bg-violet-50 hover:border-violet-500"
}
`}>

<div className="text-3xl">

🎓

</div>

<div className="mt-2 font-semibold">

Graduación

</div>

</div>

    <div
onClick={() => {

setTipoEvento("Otro");

setErrorTipo("");

}}
className={`
border
rounded-2xl
p-4
text-center
cursor-pointer
transition-all
duration-300
hover:shadow-lg
${
tipoEvento==="otro"
? "bg-violet-600 text-white border-violet-600 scale-105"
: "border-violet-200 hover:bg-violet-50 hover:border-violet-500"
}
`}>

<div className="text-3xl">

🎉

</div>

<div className="mt-2 font-semibold">

Otro

</div>

</div>

  </div>

</div>
{
errorTipo && (

<p className="text-red-500 text-center mt-4">

{errorTipo}

</p>

)
}

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
  errorFecha && (

    <p className="text-red-500 mt-2 text-sm">

      {errorFecha}

    </p>

  )
}

          </div>
          <div className="mt-8">
            <label className="block font-semibold mb-3">

Estado

</label>

<input

type="text"

value={estado}

onChange={(e)=>{

setEstado(e.target.value);

setErrorEstado("");

}}

placeholder="Jalisco"

className="w-full border border-gray-300 rounded-2xl px-5 py-4"
/>

{
errorEstado&&(

<p className="text-red-500 mt-2 text-sm">

{errorEstado}

</p>

)
}
          </div>
          

          <div className="mt-8">

            <label className="block font-semibold mb-3">

              Ciudad

            </label>

          <input

type="text"

value={ciudad}

onChange={(e)=>{

setCiudad(e.target.value);

setErrorCiudad("");

}}

placeholder="Guadalajara"

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
errorCiudad&&(

<p className="text-red-500 mt-2 text-sm">

{errorCiudad}

</p>

)
}

          </div>

          <div className="flex gap-4 mt-10">

            <button

onClick={()=>{

localStorage.setItem("evento",evento);

localStorage.setItem("tipoEvento",tipoEvento);

localStorage.setItem("fecha",fecha);

localStorage.setItem("estado",estado);

localStorage.setItem("ciudad",ciudad);

window.location.href="/crear-album/datos";

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

if(evento.trim()==""){

setErrorEvento("Ingresa el nombre del evento.");

valido=false;

}

if(tipoEvento==""){

setErrorTipo("Selecciona un tipo de evento.");

valido=false;

}

if(fecha==""){

setErrorFecha("Selecciona una fecha.");

valido=false;

}

if(estado.trim()==""){

setErrorEstado("Ingresa un estado.");

valido=false;

}

if(ciudad.trim()==""){

setErrorCiudad("Ingresa una ciudad.");

valido=false;

}

if(!valido){

return;

}

localStorage.setItem("evento",evento);

localStorage.setItem("tipoEvento",tipoEvento);

localStorage.setItem("fecha",fecha);

localStorage.setItem("estado",estado);

localStorage.setItem("ciudad",ciudad);

window.location.href="/crear-album/pago";

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