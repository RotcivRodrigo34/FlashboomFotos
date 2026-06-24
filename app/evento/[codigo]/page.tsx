import HeroCarousel from "@/app/components/HeroCarousel";
import MomentosCompartidos from "@/app/components/MomentosCompartidos";

export default function EventoPublico() {

  return (

    <main className="bg-white min-h-screen">

  <div className="w-full max-w-[430px] mx-auto">

        <HeroCarousel/>

        {/* MENSAJE */}

<section className="mt-5">

    <h2 className="text-center text-lg font-semibold text-gray-800">

        Cada fotografía cuenta una historia

    </h2>

    <p className="text-center text-sm text-gray-500 mt-1">

        Comparte la tuya

    </p>

</section>

        {/* BOTÓN */}

<section className="px-5 mt-5">

    <button

        className="
        w-full
        h-8
        rounded-full
        bg-violet-600
        text-white
    border border-violet-600
bg-violet-600
        transition
        active:scale-95
        "

    >

        <div className="flex justify-center items-center gap-3">

           <span className="text-lg">

                📷

            </span>

           <span className="font-medium text-sm">

                Subir mis fotografías

            </span>
     
        </div>

    </button>
           <MomentosCompartidos/>


</section>

      </div>

    </main>

  );

}