"use client";

import Link from "next/link";
import { useState } from "react";
import {supabase} from "@/lib/supabase";
export default function Login() {

const [correo,setCorreo]=useState("");

const [password,setPassword]=useState("");
const [mensaje,setMensaje]=useState("");
async function login(){

setMensaje("");

const {data,error}=await supabase

.from("usuarios")

.select()

.eq("correo",correo);
if(error){

setMensaje(error.message);

return;

}
if(data.length===0){

setMensaje("No encontramos una cuenta con ese correo.");

return;

}
if(data[0].password!==password){

setMensaje("Contraseña incorrecta.");

return;

}
localStorage.setItem("logueado","true");

localStorage.setItem(

"usuarioID",

data[0].id.toString()

);
window.location.href="/dashboard";

}
return (

<main className="min-h-screen bg-gradient-to-b from-white to-violet-50 flex items-center justify-center p-6">

<div className="
w-full
max-w-md
bg-white
rounded-[35px]
shadow-2xl
border
border-violet-100
p-10
">

<div className="text-center">

<span className="text-violet-600 font-semibold tracking-widest uppercase">

Flashboom Fotos

</span>

<h1 className="text-4xl font-bold mt-5">

Bienvenido

</h1>

<p className="text-gray-500 mt-5">

Ingresa a tu cuenta para administrar tus eventos.

</p>

</div>

<div className="mt-10">

<label className="block font-semibold mb-3">

Correo electrónico

</label>

<input

type="email"

value={correo}

onChange={(e)=>setCorreo(e.target.value)}
placeholder="correo@ejemplo.com"

className="
w-full
border
border-gray-300
rounded-2xl
px-5
py-4
focus:outline-none
focus:border-violet-500
"
/>

</div>

<div className="mt-8">

<label className="block font-semibold mb-3">

Contraseña

</label>

<input

type="password"

value={password}

onChange={(e)=>setPassword(e.target.value)}
placeholder="********"

className="
w-full
border
border-gray-300
rounded-2xl
px-5
py-4
focus:outline-none
focus:border-violet-500
"
/>
<Link

href="/recuperar-password"

className="text-violet-600 hover:underline text-sm"

>

¿Olvidaste tu contraseña?

</Link>

</div>

<button

onClick={login}

className="
w-full
mt-10
bg-violet-600
hover:bg-violet-700
transition
text-white
py-4
rounded-2xl
">

Iniciar sesión

</button>
{
mensaje && (

<p className="text-center text-red-500 mt-4">

{mensaje}

</p>

)
}
<div className="text-center mt-8">

<p className="text-gray-500">

¿Aún no tienes cuenta?

</p>

<Link

href="/crear-album"

className="text-violet-600 font-semibold mt-3 inline-block hover:underline"

>

Crear mi álbum

</Link>

</div>

</div>

</main>

);

}