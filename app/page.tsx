import Image from "next/image";

export default function Home() {
  return (
    
<main className="min-h-screen bg-white">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-violet-700/20 blur-[150px] rounded-full"></div>

      {/* HEADER */}

<header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg shadow-sm">

  <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">

    <Image
      src="/logofb.png"
      alt="FlashboomFotos"
      width={170}
      height={60}
    />

    <nav className="hidden lg:flex gap-8 text-gray-700">

      <a href="#" className="hover:text-violet-600 transition">
        Cómo funciona
      </a>

      <a href="#" className="hover:text-violet-600 transition">
        Eventos
      </a>

      <a href="#" className="hover:text-violet-600 transition">
        Planes
      </a>

      <a href="#" className="hover:text-violet-600 transition">
        FAQ
      </a>

    </nav>

    <div className="flex gap-4 items-center">

      <button className="hidden md:block text-gray-700 hover:text-violet-600">

        Iniciar sesión

      </button>

      <button className="bg-violet-600 hover:bg-violet-700 transition text-white px-6 py-3 rounded-xl">

        Crear mi álbum

      </button>

    </div>

  </div>

</header>


{/* HERO */}

<section className="max-w-7xl mx-auto px-6 pt-16 pb-20">

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

        <button className="bg-violet-600 hover:bg-violet-700 transition text-white px-8 py-4 rounded-xl shadow-lg">

          Crear mi álbum

        </button>

        <button className="border border-gray-300 hover:border-violet-600 transition px-8 py-4 rounded-xl text-gray-800">

          Ver planes

        </button>

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


<section className="pb-28">

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

    </main>
  );
}