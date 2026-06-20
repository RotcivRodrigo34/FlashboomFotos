"use client";

export default function EventCard({

evento,
abierto,
index,
setAbierto

}:any){

return(

<div

onClick={()=>{

setAbierto(

abierto===index

?

null

:

index

);

}}

className="
cursor-pointer
bg-white
rounded-3xl
p-8
shadow-lg
border
border-violet-100
hover:shadow-violet-200/50
hover:shadow-xl
transition
"

>

<div className="flex justify-between items-center">
   <div>
      <h3 className="text-2xl font-bold">
         {evento.icono} {evento.nombre}
      </h3>
      <p className="text-gray-500 mt-3">
         📅 {evento.fecha}
      </p>
      <p className="text-gray-500 mt-2">
        📍 {evento.ciudad}
      </p>
   </div>
   <div
     className="
     text-4xl
     text-violet-600
     transition
     duration-300
     ">
     {
       abierto===index
       ?
       "⌃"
       :
       "⌄"
     }
   </div>
</div>

{

abierto===index&&(

<div className="mt-8 border-t border-violet-100 pt-8">
   <div className="grid md:grid-cols-2 gap-6">
      <div className="mt-6">
         <p className="text-gray-400"> Estado </p>
         <p className="font-semibold text-green-600"> 🟢 Activo </p>
      </div>
   </div>
   <div className="grid md:grid-cols-2 gap-4 mt-8">
      <button className="border rounded-2xl py-3 hover:bg-violet-50">
        ✏ Editar
      </button>
      <button className="border rounded-2xl py-3 hover:bg-violet-50">
        ☁ Configurar Google Drive
      </button>
      <button className="border rounded-2xl py-3 hover:bg-violet-50">
         🎨 Plantillas
      </button>
      <button className="border rounded-2xl py-3 hover:bg-violet-50">
         🔳 QR
      </button>
   </div>
</div>

)
}
</div>
);
}