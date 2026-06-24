import HeroCarousel from "@/app/components/HeroCarousel";
import MomentosCompartidos from "@/app/components/MomentosCompartidos";
import UploadButton from "@/app/components/UploadButton";
export default async function EventoPublico({

    params

}:{

    params:Promise<{

        codigo:string;

    }>

}){

const {codigo}=await params;
  
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

 <UploadButton

    codigoEvento={codigo}

/>

  <MomentosCompartidos/>

</section>

  



      </div>

    </main>

  );

}