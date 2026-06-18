"use client";

import Link from "next/link";

export default function Login() {

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

</div>

<button

onClick={()=>{

localStorage.setItem("logueado","true");

window.location.href="/dashboard";

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
">

Iniciar sesión

</button>
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