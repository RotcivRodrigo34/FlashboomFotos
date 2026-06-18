"use client";

import Link from "next/link";

export default function Dashboard() {

  return (

    <main className="min-h-screen bg-gradient-to-b from-white to-violet-50">

      <section className="max-w-6xl mx-auto px-6 py-20">

        <div className="text-center">

          <span className="text-violet-600 font-semibold tracking-widest uppercase">

            Flashboom Fotos

          </span>

          <h1 className="text-5xl font-bold mt-5">

            Mi Panel

          </h1>

          <p className="text-gray-500 text-xl mt-8">

            Administra tus eventos y comparte tus mejores recuerdos.

          </p>

        </div>

        <div className="mt-16 grid lg:grid-cols-2 gap-8">

          <Link
            href="/crear-album"
            className="
            bg-violet-600
            hover:bg-violet-700
            transition
            rounded-[30px]
            p-10
            text-white
            shadow-xl">

            <p className="text-6xl">

              ➕

            </p>

            <h2 className="text-3xl font-bold mt-6">

              Crear nuevo evento

            </h2>

            <p className="mt-4 text-violet-100">

              Comienza a crear un nuevo álbum digital.

            </p>

          </Link>

          <div
            className="
            bg-white
            rounded-[30px]
            p-10
            shadow-xl
            border
            border-violet-100">

            <p className="text-6xl">

              📸

            </p>

            <h2 className="text-3xl font-bold mt-6">

              Mis eventos

            </h2>

            <p className="text-gray-500 mt-4">

              Aún no tienes eventos creados.

            </p>

          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <button
          className="
          bg-white
          border
          border-violet-200
          rounded-2xl
          py-5
          shadow-md
          hover:shadow-xl
          transition">

            ⚙ Configuración

          </button>
<button

onClick={()=>{

localStorage.removeItem("logueado");

window.location.href="/";

}}

className="
bg-white
border
border-red-200
rounded-2xl
py-5
text-red-500
shadow-md
hover:shadow-xl
transition">

🚪 Cerrar sesión

</button>

        </div>

      </section>

    </main>

  );

}