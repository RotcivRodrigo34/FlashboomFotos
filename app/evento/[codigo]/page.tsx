import HeroCarousel from "@/app/components/HeroCarousel";
import EventoFotos from "@/app/components/EventoFotos";
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
function formatearFecha(fecha: string) {

    return new Date(fecha).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

}
const { data: evento, error } = await supabase
  .from("eventos")
  .select("*")
  .eq("codigo", codigo)
  .maybeSingle();

console.log("Código recibido:", codigo);
console.log("Evento consultado:", evento);

if (error) {
  console.error("Error de Supabase:", {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
  });
}

if (error || !evento) {
  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">
        No se encontró el evento
      </h1>

      <p className="mt-3">
        Código recibido: {codigo}
      </p>

      <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-gray-100 p-4 text-sm">
        {JSON.stringify(
          {
            message: error?.message,
            code: error?.code,
            details: error?.details,
            hint: error?.hint,
          },
          null,
          2
        )}
      </pre>
    </main>
  );
}

if (error || !evento) {
  console.error("Error al consultar el evento:", error);
  console.error("Código recibido en la ruta:", codigo);

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">No se encontró el evento</h1>
      <p>Código consultado: {codigo}</p>
      <pre className="mt-4 whitespace-pre-wrap">
        {JSON.stringify(error, null, 2)}
      </pre>
    </main>
  );
}

const { data: imagenesPortada } = await supabase
  .from("imagenes_portada")
  .select("imagen_url, posicion")
  .eq("evento_id", evento.id)
  .order("posicion", { ascending: true });

const portadas = imagenesPortada?.map((imagen) => imagen.imagen_url) || [];
  
  return (

<main className="bg-white min-h-screen">
   <div className="w-full max-w-[430px] mx-auto">
       <HeroCarousel imagenes={portadas} />
        <section className="px-5 mt-4 text-center">

   <h1 className="text-2xl font-bold text-gray-900">

        {evento.nombre_evento}

    </h1>

<p className="text-gray-500 text-sm">

    {formatearFecha(evento.fecha)}

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

<EventoFotos

    codigoEvento={codigo}

/>

</section>

  



      </div>

    </main>

  );

}