"use client";

import Link from "next/link";
import {useState} from "react";

export default function Dashboard(){
  
 const [abierto,setAbierto]=useState<number|null>(null);

const eventos=[
{
icono:"💒",
nombre:"Boda Ana y Pedro",
fecha:"20 Julio 2026",
ciudad:"Guadalajara",
cliente:"Ana y Pedro",
correo:"ana@ejemplo.com"
},
{
icono:"👑",
nombre:"XV Fernanda",
fecha:"28 Julio 2026",
ciudad:"CDMX",
cliente:"Fernanda",
correo:"fernanda@ejemplo.com"
},
{
icono:"🎂",
nombre:"Cumple Daniel",
fecha:"15 Agosto 2026",
ciudad:"Monterrey",
cliente:"Daniel",
correo:"daniel@ejemplo.com"
}
];

return(

<main className="min-h-screen bg-gradient-to-b from-white to-violet-50">

<section className="max-w-6xl mx-auto px-6 py-20">

<div className="flex justify-between items-center">

<div>

<p className="text-violet-600 uppercase tracking-[4px] font-semibold">

Flashboom Fotos

</p>

<h1 className="text-5xl font-bold mt-3">

Mis Eventos

</h1>

</div>

<Link

href="/crear-album"

className="
bg-violet-600
hover:bg-violet-700
transition
text-white
px-6
py-4
rounded-2xl">

+ Nuevo Evento

</Link>

</div>

<div className="mt-16">

<h2 className="text-3xl font-bold">

2026

</h2>

<p className="text-gray-400 mt-2 uppercase tracking-[3px]">

Julio

</p>

<div className="mt-8 space-y-6">

{
eventos.slice(0,2).map((evento,index)=>(

<div

key={index}

onClick={()=>{

setAbierto(

abierto===index

?

null

:

index

);

}}

className="
cursor-pointer
bg-white
rounded-3xl
p-8
shadow-lg
border
border-violet-100
hover:shadow-violet-200/50
hover:shadow-xl
transition
">

<div className="flex justify-between items-center">

<div>

<h3 className="text-2xl font-bold">

{evento.icono} {evento.nombre}

</h3>

<p className="text-gray-500 mt-3">

📅 {evento.fecha}

</p>

<p className="text-gray-500 mt-2">

📍 {evento.ciudad}

</p>

</div>

<div
className="
text-4xl
text-violet-600
transition
duration-300
">

{
abierto===index
?
"⌃"
:
"⌄"
}

</div>

{
abierto===index&&(

<div className="mt-8 border-t border-violet-100 pt-8">

<div className="grid md:grid-cols-2 gap-6">

<div>

<p className="text-gray-400">

Cliente

</p>

<p className="font-semibold">

{evento.cliente}

</p>

</div>

<div>

<p className="text-gray-400">

Correo

</p>

<p className="font-semibold">

{evento.correo}

</p>

</div>
<div className="mt-6">

<p className="text-gray-400">

Estado

</p>

<p className="font-semibold text-green-600">

🟢 Activo

</p>

</div>
</div>

<div className="grid md:grid-cols-2 gap-4 mt-8">

<button className="border rounded-2xl py-3 hover:bg-violet-50">

✏ Editar

</button>

<button className="border rounded-2xl py-3 hover:bg-violet-50">

☁ Configurar Google Drive

</button>

<button className="border rounded-2xl py-3 hover:bg-violet-50">

🎨 Plantillas

</button>

<button className="border rounded-2xl py-3 hover:bg-violet-50">

🔳 QR

</button>

</div>

</div>

)
}

</div>

</div>

))
}

</div>

<p className="text-gray-400 mt-12 uppercase tracking-[3px]">

Agosto

</p>

<div className="mt-8">

<div

className="
bg-white
rounded-3xl
p-8
shadow-lg
border
border-violet-100
hover:shadow-violet-200/50
hover:shadow-xl
transition">

<div className="flex justify-between items-center">

<div>

<h3 className="text-2xl font-bold">

🎂 Cumple Daniel

</h3>

<p className="text-gray-500 mt-3">

📅 15 Agosto 2026

</p>

<p className="text-gray-500 mt-2">

📍 Monterrey

</p>

</div>

<div className="text-4xl text-violet-600">

⌄

</div>

</div>

</div>

</div>

</div>

</section>

</main>

);

}