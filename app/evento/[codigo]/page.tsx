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
bg-violet-600
hover:bg-violet-700
text-white
font-semibold
text-lg
py-4
rounded-full
transition
shadow-lg
"

    >

        <div className="flex justify-center items-center gap-3">

           <span className="text-lg">

                📷

            </span>

           <span className="font-medium text-lg">

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