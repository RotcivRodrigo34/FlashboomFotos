"use client";

import Link from "next/link";
import {useState,useEffect} from "react";
import {supabase} from "@/lib/supabase";
import EventCard from "@/app/components/EventCard";
import Header from "@/app/components/Header";
import GoogleDriveCard from "@/app/components/GoogleDriveCard";
export default function Dashboard(){
  
const [abierto,setAbierto]=useState<number|null>(null);
const [usuarioID,setUsuarioID]=useState("");
const [eventosDB,setEventosDB]=useState<any[]>([]);
useEffect(()=>{

const logueado=localStorage.getItem("logueado");

const usuario=localStorage.getItem("usuarioID");

if(!logueado){

window.location.href="/login";

return;

}

if(usuario){

setUsuarioID(usuario);

}

},[]);
useEffect(()=>{

if(!usuarioID){

return;

}

async function cargarEventos(){
    

const {data,error}=await supabase

.from("eventos")

.select()

.eq("usuario_id",Number(usuarioID))

.order("fecha",{ascending:true});

if(error){

alert(error.message);

return;

}

setEventosDB(data||[]);

}

cargarEventos();

},[usuarioID]);

const meses=[
   "Enero",
   "Febrero",
   "Marzo",
   "Abril",
   "Mayo",
   "Junio",
   "Julio",
   "Agosto",
   "Septiembre",
   "Octubre",
   "Noviembre",
   "Diciembre"
   ];

const eventosAgrupados=eventosDB.reduce((acc:any,evento:any)=>{
const fecha=new Date(evento.fecha);
const anio=fecha.getFullYear();
const mes=meses[fecha.getMonth()];

if(!acc[anio]){
acc[anio]={};
}

if(!acc[anio][mes]){
acc[anio][mes]=[];
}

acc[anio][mes].push(evento);
return acc;
},{});

return(

<>

<Header/>

<main className="min-h-screen bg-gradient-to-b from-white to-violet-50">
   <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="flex justify-between items-center">
         <div>
            <p className="text-violet-600 uppercase tracking-[4px] font-semibold">
               Flashboom Fotos
            </p> 
            <h1 className="text-5xl font-bold mt-3"> Mis Eventos </h1>
            <p className="mt-4 text-violet-600">
               Eventos contratados: {eventosDB.length}
            </p>            
        </div>
    </div>
    <div className="mt-10">

      <GoogleDriveCard/>
    </div>
<div className="mt-16">

{

Object.keys(eventosAgrupados).map((anio)=>(

<div key={anio}>

<h2 className="text-3xl font-bold">

{anio}

</h2>

{

Object.keys(eventosAgrupados[anio]).map((mes)=>(

<div key={mes}>

<p className="text-gray-400 mt-8 uppercase tracking-[3px]">

{mes}

</p>

<div className="mt-8 space-y-6">

{

eventosAgrupados[anio][mes].map((evento:any,index:number)=>(

<EventCard

key={index}

evento={{

icono:"🎉",

nombre:evento.nombre_evento,

fecha:evento.fecha,

ciudad:evento.ciudad

}}

index={evento.id}

abierto={abierto}

setAbierto={setAbierto}

/>

))

}

</div>

</div>

))

}

</div>

))

}

</div>
</section>
</main>

</>

);
}