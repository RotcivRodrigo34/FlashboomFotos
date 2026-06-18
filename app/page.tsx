"use client";
import Image from "next/image";
import FaqItem from "./components/FaqItem";
import Link from "next/link";


import { useState,useEffect } from "react";

export default function Home() {
  const [logueado,setLogueado]=useState(false);

useEffect(()=>{

const login=localStorage.getItem("logueado");

if(login=="true"){

setLogueado(true);

}

},[]);
  return (
    
<main id="inicio" className="min-h-screen bg-white">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-violet-700/20 blur-[150px] rounded-full"></div>

      {/* HEADER */}

<header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg shadow-sm">

  <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">

    <a href="#inicio">
  <Image
    src="/logofb.png"
    alt="FlashboomFotos"
    width={170}
    height={60}
  />
</a>

    <nav className="hidden lg:flex gap-8 text-gray-700">
      
      <a  href="#inicio" className="hover:text-violet-600 transition">
       Inicio
      </a>

      <a  href="#como-funciona" className="hover:text-violet-600 transition">
        Cómo funciona
      </a>
      
      {/* para despues 
      //<a href="#eventos" className="hover:text-violet-600 transition">
        Eventos
      </a>
      */}

      <a href="#planes" className="hover:text-violet-600 transition">
        Planes
      </a>

      <a href="#faq" className="hover:text-violet-600 transition">
        FAQ
      </a>
      {
logueado && (

<Link
href="/dashboard"
className="hover:text-violet-600 transition">

Mis Eventos

</Link>

)
}

    </nav>

    <div className="flex gap-4 items-center">

     {
!logueado ? (

<Link

href="/login"

className="hidden md:block text-gray-700 hover:text-violet-600">

Iniciar sesión


</Link>

)

:

(

<button

onClick={()=>{

localStorage.removeItem("logueado");

window.location.reload();

}}

className="hidden md:block text-gray-700 hover:text-violet-600">

Cerrar sesión

</button>

)
}

{
!logueado && (

<Link

href="/crear-album"

className="
bg-violet-600
hover:bg-violet-700
transition
text-white
px-6
py-3
rounded-xl">

Crear mi álbum

</Link>

)
}

    </div>

  </div>

</header>


{/* HERO */}

<section  className="max-w-7xl mx-auto px-6 pt-16 pb-20">

  <div className="grid lg:grid-cols-2 gap-16 items-center">

    {/* TEXTO */}

    <div>

      <h2 className="text-5xl lg:text-3xl font-bold text-gray-900 leading-tight">

        Convierte las fotos de tus invitados

        <br />

         en el mejor álbum de tu evento

      </h2>

      <p className="text-gray-500 text-xl mt-10 leading-9 max-w-xl">

        Comparte un código QR personalizado
        y recibe fotos, videos y recuerdos
        de todos tus invitados en un solo lugar.

      </p>

      {/* PASOS */}

      <div className="flex gap-10 mt-12">

        <div className="text-center">

          <div className="text-3xl">

            📱

          </div>

          <p className="text-sm text-gray-600 mt-2">

            Escanean

            <br />

            el QR

          </p>

        </div>

        <div className="text-center">

          <div className="text-3xl">

            📷

          </div>

          <p className="text-sm text-gray-600 mt-2">

            Invitados

            <br />

            toman fotos

          </p>

        </div>

        <div className="text-center">

          <div className="text-3xl">

            ☁️

          </div>

          <p className="text-sm text-gray-600 mt-2">

            Se guardan

            <br />

            automáticamente

          </p>

        </div>

      </div>

      {/* BOTONES */}

      <div className="flex gap-5 mt-12">

        <Link
  href="/crear-album"
  className="
  bg-violet-600
  hover:bg-violet-700
  transition
  text-white
  px-8
  py-4
  rounded-xl
  inline-block
  text-center"
>

  Crear mi álbum

</Link>
<a
  href="#planes"
  className="
  border
  border-gray-300
  hover:border-violet-600
  transition
  px-8
  py-4
  rounded-xl
  text-gray-800
  inline-block"
>

  Ver planes

</a>

      </div>

    </div>

    {/* IMAGENES */}

    <div className="relative h-[550px] hidden lg:block">

      <div className="absolute top-0 left-0 relative w-72 h-48 rounded-3xl shadow-2xl rotate-[-6deg] overflow-hidden">
          <Image
              src="/boda1.png"
              alt="Boda"
              fill
              className="object-cover"
          />
      </div>

      <div className="absolute top-10 right-0 w-72 h-48 bg-pink-100 rounded-3xl shadow-2xl rotate-[20deg]  overflow-hidden">

        <Image
              src="/XV.png"
              alt="Boda"
              fill
              className="object-cover"
          />
      </div>

      <div className="absolute bottom-10 right-0 w-85 h-60 bg-purple-100 rounded-3xl shadow-2xl rotate-[5deg] overflow-hidden">
        <Image
              src="/fiesta.png"
              alt="Boda"
              fill
              className="object-cover"
          />
      </div>

      <div className="absolute left-28 top-36 w-60 h-84 bg-white rounded-3xl shadow-2xl rotate-[-8deg] flex items-center justify-center ">
        <Image
              src="/qrpostal.png"
              alt="Boda"
              fill
              className="object-cover"
          />

        <div className="text-center">

          <div className="text-6xl">

            📱

          </div>

          <p className="mt-6 text-gray-700 font-semibold">

            Código QR

          </p>

          <p className="text-gray-400 text-sm">

            FlashboomFotos

          </p>

        </div>

      </div>

    </div>

  </div>

</section>


{/* TRANSICION */}

<section className="py-16">

  <div className="max-w-7xl mx-auto px-6">

    <div className="h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent"></div>

  </div>

</section>


<section id="como-funciona" className="pb-28 scroll-mt-45">

  <div className="max-w-7xl mx-auto px-6">

    <div className="text-center">

      <span className="text-violet-600 font-semibold tracking-widest uppercase">

        Cómo funciona

      </span>

      <h3 className="text-5xl font-bold text-gray-900 mt-5">

        Tres pasos

        <br />

        Miles de recuerdos

      </h3>

      <p className="text-gray-500 text-xl max-w-3xl mx-auto mt-8">

        Tus invitados solo necesitan su celular
        para compartir cada momento especial.

      </p>
      <div className="max-w-3xl mx-auto mt-16"></div>

    </div>

    
<div className="grid lg:grid-cols-3 gap-10 mt-20">

{/* TARJETA 1 */}

<div className="group relative bg-white rounded-[35px] shadow-lg hover:shadow-2xl hover:shadow-violet-200/50 hover:-translate-y-3 transition-all duration-500 overflow-hidden">

  <div className="absolute right-6 top-4 text-8xl font-black text-violet-100 transition-all duration-500 group-hover:text-violet-300">

    01

  </div>

  <div className="relative h-64 overflow-hidden">

    <Image
      src="/como-funciona/qrpasos.png"
      alt="Escanea el QR"
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-110"
    />

  </div>

  <div className="p-8">

    <h3 className="text-3xl font-bold text-gray-900">

      Escanea el QR

    </h3>

    <p className="text-gray-500 mt-5 leading-8">

      Los invitados escanean el código QR desde cualquier celular.

    </p>

  </div>

</div>

{/* TARJETA 2 */}

<div className="group relative bg-white rounded-[35px] shadow-lg hover:shadow-2xl hover:shadow-pink-200/50 hover:-translate-y-3 transition-all duration-500 overflow-hidden">

  <div className="absolute right-6 top-4 text-8xl font-black text-pink-100 transition-all duration-500 group-hover:text-pink-300">

    02

  </div>

  <div className="relative h-64 overflow-hidden">

    <Image
      src="/como-funciona/subirfoto.png"
      alt="Subir fotos"
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-110"
    />

  </div>

  <div className="p-8">

    <h3 className="text-3xl font-bold text-gray-900">

      Sube tus fotos

    </h3>

    <p className="text-gray-500 mt-5 leading-8">

      Tus invitados comparten fotos,
      videos y recuerdos desde su celular.

    </p>

  </div>

</div>

{/* TARJETA 3 */}

<div className="group relative bg-white rounded-[35px] shadow-lg hover:shadow-2xl hover:shadow-purple-200/50 hover:-translate-y-3 transition-all duration-500 overflow-hidden">

  <div className="absolute right-6 top-4 text-8xl font-black text-purple-100 transition-all duration-500 group-hover:text-purple-300">

    03

  </div>

  <div className="relative h-64 overflow-hidden">

    <Image
      src="/como-funciona/verfotos.png"
      alt="Disfruta los recuerdos"
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-110"
    />

  </div>

  <div className="p-8">

    <h3 className="text-3xl font-bold text-gray-900">

      Disfruta los recuerdos

    </h3>

    <p className="text-gray-500 mt-5 leading-8">

      Los festejados reciben todos los recuerdos
      en un solo álbum.

    </p>

  </div>

</div>

</div>
</div>

</section>

{/* TRANSICIÓN */}

<section className="py-16">

  <div className="max-w-7xl mx-auto px-6">

    <div className="h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent"></div>

  </div>

</section>

{/* PLAN */}

<section id="planes" className="pb-28 scroll-mt-45">

  <div className="max-w-7xl mx-auto px-6">

    <div className="text-center">

      <span className="text-violet-600 font-semibold tracking-widest uppercase">

        Elige tu plan

      </span>

      <h2 className="text-5xl font-bold text-gray-900 mt-5">

        Todo lo que incluye

        <br />

        tu evento

      </h2>

      <p className="text-gray-500 text-xl max-w-3xl mx-auto mt-8">

        Un solo pago.
        Sin complicaciones.
        Todo lo necesario para capturar
        los mejores recuerdos.

      </p>

    </div>

    <div className="max-w-3xl mx-auto mt-16">

      <div className="bg-white rounded-[35px] shadow-xl border border-violet-100 p-8">

        <div className="text-center">

          <span className="bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold">

            Plan Único

          </span>

          <h3 className="text-3xl font-bold text-gray-900 mt-6">

            Flashboom Fotos

          </h3>

          <div className="mt-5">

            <span className="text-5xl font-black text-violet-600">

              $299

            </span>

            <p className="text-gray-500 mt-2">

              Pago único por evento

            </p>

          </div>

        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>📸 1 evento</div>

          <div>👥 Invitados ilimitados</div>

          <div>🖼️ Fotos ilimitadas*</div>

          <div>🎥 Videos ilimitados*</div>

          <div>📱 Código QR personalizado</div>

          <div>🔒 Álbum privado</div>

          <div>☁️ Google Drive integrado</div>

          <div>⬇️ Descarga completa</div>

          <div>📅 12 meses de acceso</div>

        </div>

        <Link
  href="/crear-album"
  className="
  bg-violet-600
  hover:bg-violet-700
  transition
  text-white
  px-8
  py-4
  rounded-xl
  inline-block
  text-center"
>

  Crear mi álbum

</Link>

        <p className="text-xs text-center text-gray-400 mt-5">

          *Sujeto al espacio disponible en tu cuenta de Google.

        </p>

      </div>

    </div>

  </div>

</section>

{/* TRANSICIÓN */}

<section className="py-16">

  <div className="max-w-7xl mx-auto px-6">

    <div className="h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent"></div>

  </div>

</section>

{/* TESTIMONIOS */}

<section id="testimonios" className="pb-28 scroll-mt-45">

<div className="max-w-6xl mx-auto px-6">

<div className="text-center mb-16">

<span className="text-violet-600 font-semibold tracking-widest uppercase">

Testimonios

</span>

<h2 className="text-5xl font-bold text-gray-900 mt-5">

Nuestros clientes

</h2>

<p className="text-gray-500 text-xl mt-6">

Ellos ya vivieron la experiencia Flashboom Fotos.

</p>

</div>

<div className="space-y-8">

{/* 1 */}

<div className="
group
max-w-xl
bg-white
rounded-3xl
shadow-lg
p-6
transition-all
duration-500
hover:-translate-y-2
hover:shadow-2xl
hover:shadow-violet-300/40
relative
overflow-hidden">

<div className="flex items-center gap-5 relative z-10">

<div className="
relative
w-24
h-24
rounded-full
overflow-hidden
shadow-lg
transition-all
duration-500
group-hover:scale-110">

<Image
src="/testimonios/mariajoseboda.png"
alt="María y José"
fill
className="object-cover transition-transform duration-700 group-hover:scale-110"
/>

</div>

<div>

<p className="
text-gray-600
italic
transition-all
duration-500
group-hover:text-gray-800">

"Todos nuestros invitados participaron
y tuvimos recuerdos increíbles."

</p>

<h4 className="
font-bold
mt-3
transition-all
duration-500
group-hover:text-violet-700">

María & José

</h4>

<span className="
text-violet-600
transition-all
duration-500
group-hover:text-violet-500">

Boda

</span>

</div>

</div>
<div className="
absolute
bottom-0
left-0
h-1
w-0
bg-violet-500
transition-all
duration-500
group-hover:w-full">
</div>
</div>

{/* 2 */}

<div className="
group
max-w-xl
bg-white
rounded-3xl
shadow-lg
p-6
ml-auto
transition-all
duration-500
hover:-translate-y-2
hover:shadow-2xl
hover:shadow-pink-300/40
relative
overflow-hidden">

<div className="flex items-center gap-5">

<div className="
relative
w-24
h-24
rounded-full
overflow-hidden
shadow-lg
transition-all
duration-500
group-hover:scale-110">

<Image
  src="/testimonios/xvfernanda.png"
  alt="Fernanda"
  fill
 className="
object-cover
object-[center_20%]
transition-transform
duration-700
group-hover:scale-110"
/>
</div>

<div>

<p className="text-gray-600 italic">

"Fue súper sencillo,
todos escanearon el QR."

</p>

<h4 className="font-bold mt-3">

Fernanda

</h4>

<span className="text-violet-600">

XV Años

</span>

</div>

</div>
<div className="
absolute
bottom-0
left-0
h-1
w-0
bg-violet-500
transition-all
duration-500
group-hover:w-full">
</div>
</div>

{/* 3 */}

<div className="
group
max-w-xl
bg-white
rounded-3xl
shadow-lg
p-6
transition-all
duration-500
hover:-translate-y-2
hover:shadow-2xl
hover:shadow-purple-300/40
relative
overflow-hidden">

<div className="flex items-center gap-5">

<div
  className="
  relative
  w-24
  h-24
  rounded-full
  overflow-hidden
  shadow-lg
  transition-all
  duration-500
  group-hover:scale-110"
>

  <Image
    src="/testimonios/luiscumple.png"
    alt="Luis"
    fill
    className="
    object-cover
    object-center
    transition-transform
    duration-700
    group-hover:scale-110"
  />

</div>

<div>

<p className="text-gray-600 italic">

"Nos encantó tener todas las fotos
en un solo lugar."

</p>

<h4 className="font-bold mt-3">

Luis

</h4>

<span className="text-violet-600">

Cumpleaños

</span>

</div>

</div>
<div className="
absolute
bottom-0
left-0
h-1
w-0
bg-violet-500
transition-all
duration-500
group-hover:w-full">
</div>
</div>

{/* 4 */}

<div className="
group
max-w-xl
bg-white
rounded-3xl
shadow-lg
p-6
ml-auto
transition-all
duration-500
hover:-translate-y-2
hover:shadow-2xl
hover:shadow-pink-200/50
relative
overflow-hidden">

<div className="flex items-center gap-5">

<div
  className="
  relative
  w-24
  h-24
  min-w-24
  min-h-24
  flex-shrink-0
  rounded-full
  overflow-hidden
  shadow-lg
  transition-all
  duration-500
  group-hover:scale-110">

  <Image
    src="/testimonios/anababy.png"
    alt="Ana"
    fill
    className="
    object-cover
    object-center
    transition-transform
    duration-700
    group-hover:scale-110"
  />

</div>

<div>

<p className="text-gray-600 italic">

"Fue hermoso ver todas las fotos
y mensajes que nuestra familia
compartió durante el Baby Shower"

</p>

<h4 className="
font-bold
mt-3
transition-all
duration-500
group-hover:text-violet-700">

Ana

</h4>

<span className="
text-violet-600
transition-all
duration-500
group-hover:text-violet-500">

Baby Shower

</span>

</div>

</div>
<div className="
absolute
bottom-0
left-0
h-1
w-0
bg-violet-500
transition-all
duration-500
group-hover:w-full">
</div>
</div>

</div>

</div>

</section>
{/* TRANSICIÓN */}

<section className="py-16">

  <div className="max-w-7xl mx-auto px-6">

    <div className="h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent"></div>

  </div>

</section>


{/* FAQ */}

<section id="faq" className="pb-28 scroll-mt-45">

<div className="max-w-5xl mx-auto px-6">

<div className="text-center">

<span className="text-violet-600 font-semibold tracking-widest uppercase">

Preguntas frecuentes

</span>

<h2 className="text-5xl font-bold text-gray-900 mt-5">

Todo lo que necesitas saber

</h2>

<p className="text-gray-500 text-xl mt-8">

Queremos que disfrutes tu evento.
Aquí respondemos las dudas más comunes.

</p>

</div>

<div className="mt-16 space-y-6">

<FaqItem
question="📱 ¿Necesitan instalar una app?"
answer="No necesitas instalar nada. Todo funciona desde el navegador de tu celular."
/>

<FaqItem
question="👥 ¿Cuántos invitados pueden participar?"
answer="No existe un límite de invitados. Comparte tu código QR con todos los asistentes."
/>

<FaqItem
question="📸 ¿Las fotos son ilimitadas?"
answer="Cada cuenta de Google incluye 15 GB gratuitos, suficientes para miles de fotografías y numerosos videos."
/>

<FaqItem
question="☁️ ¿Cómo crear una cuenta de Google Drive?"
answer="Solo necesitas una cuenta de Google gratuita. Durante la configuración te guiaremos paso a paso."
/>

<FaqItem
question="🎥 ¿Qué pasa con los videos?"
answer="Tus invitados también podrán compartir videos que se almacenarán junto con las fotografías."
/>

<FaqItem
question="❤️ ¿Cuánto tiempo dura el álbum?"
answer="Tus recuerdos permanecerán disponibles mientras mantengas activa tu cuenta de Google."
/>

<FaqItem
question="💬 ¿Si tengo dudas con quién me contacto?"
answer="Contamos con atención personalizada vía WhatsApp para ayudarte antes, durante y después de tu evento."
/>

</div>
</div>
</section>

{/* FOOTER */}
<footer className="bg-gradient-to-b from-white to-violet-50">
      <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid lg:grid-cols-3 gap-12">
{/* LOGO */}
            <div>

           <a href="#inicio">
  <Image
    src="/logofb.png"
    alt="FlashboomFotos"
    width={170}
    height={60}
  />
</a>

<p className="text-gray-500 mt-6 leading-8">

Convierte las fotos de tus invitados
en recuerdos inolvidables.

</p>

</div>

{/* NAVEGACIÓN */}

<div>

<h3 className="font-bold text-xl text-gray-900">

Navegación

</h3>

<div className="flex flex-col gap-4 mt-6 text-gray-500">

<a href="#como-funciona" className="hover:text-violet-600 transition">

Cómo funciona

</a>

<a href="#planes" className="hover:text-violet-600 transition">

Planes

</a>

<a href="#testimonios" className="hover:text-violet-600 transition">

Testimonios

</a>

<a href="#faq" className="hover:text-violet-600 transition">

FAQ

</a>

</div>

</div>

{/* CONTACTO */}

<div>

<h3 className="font-bold text-xl text-gray-900">

Flashboom Fotos

</h3>

<p className="text-gray-500 mt-6 leading-8">

Plataforma para compartir
fotos y videos de eventos
mediante códigos QR.

</p>

<div className="mt-6">

<Link
  href="/crear-album"
  className="
  bg-violet-600
  hover:bg-violet-700
  transition
  text-white
  px-8
  py-4
  rounded-xl
  inline-block
  text-center"
>

  Crear mi álbum

</Link>

</div>

</div>

</div>

<div className="border-t border-violet-100 mt-16 pt-8">

<p className="text-center text-gray-400">

© 2026 Flashboom Fotos.
Todos los derechos reservados.

</p>

</div>

</div>

</footer>
    </main>
  );
}