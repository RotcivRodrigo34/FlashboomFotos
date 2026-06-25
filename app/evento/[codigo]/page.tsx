import HeroCarousel from "@/app/components/HeroCarousel";
import MomentosCompartidos from "@/app/components/MomentosCompartidos";
import UploadButton from "@/app/components/UploadButton";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
export default async function EventoPublico({

    params

}:{

    params:Promise<{

        codigo:string;

    }>

}){

const {codigo}=await params;
const { data: evento, error } = await supabase
  .from("eventos")
  .select("*")
  .eq("codigo", codigo)
  .single();

if (error || !evento) {

  notFound();

}
  
  return (

<main className="bg-white min-h-screen">
   <div className="w-full max-w-[430px] mx-auto">
        <HeroCarousel/>
        <section className="px-5 mt-4">

    <h1 className="text-2xl font-bold">

        {evento.nombre_evento}

    </h1>

    <p className="text-gray-500">

        {evento.tipo_evento}

    </p>

    <p className="text-gray-500">

        {evento.fecha}

    </p>

</section>
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

<MomentosCompartidos

    codigoEvento={codigo}

/>

</section>

  



      </div>

    </main>

  );

}