"use client";

import {useState} from "react";
import Link from "next/link";
import {supabase} from "@/lib/supabase";
import {v4 as uuidv4} from "uuid";
export default function RecuperarPassword(){

const [correo,setCorreo]=useState("");
const [mensaje,setMensaje]=useState("");

async function recuperar(){

   setMensaje("");
   const {data,error}=await supabase
   .from("usuarios")
   .select()
   .eq("correo",correo);
   if(error){
      setMensaje(error.message);
      return;
    }
    if(data.length===0){
      setMensaje("No encontramos una cuenta con ese correo.");
      return;
    }
    const token=uuidv4();
    console.log(token);
    alert("Token generado correctamente");

}

return(

<main className="min-h-screen bg-gradient-to-b from-white to-violet-50 flex items-center justify-center p-6">
   <div className="w-full max-w-md bg-white rounded-[35px] shadow-2xl border border-violet-100 p-10">
      <div className="text-center">
         <span className="text-violet-600 font-semibold tracking-widest uppercase">
            Flashboom Fotos
         </span>
         <h1 className="text-4xl font-bold mt-5">
           Recuperar contraseña
         </h1>
         <p className="text-gray-500 mt-5">
            Ingresa tu correo electrónico.
         </p>
      </div>
      <div className="mt-10">
         <label className="block font-semibold mb-3">
            Correo electrónico
         </label>
         <input
            type="email"
            value={correo}
            onChange={(e)=>setCorreo(e.target.value)}
            placeholder="correo@ejemplo.com"
            className="
            w-full
            border
            border-gray-300
            rounded-2xl
            px-5
            py-4
            focus:outline-none
            focus:border-violet-500"
            />
      </div>
      <button
         onClick={recuperar}
         className="
         w-full
         mt-10
         bg-violet-600
         hover:bg-violet-700
         transition
         text-white
         py-4
         rounded-2xl"
         >
            Enviar enlace
      </button>
      {
         mensaje && (
        <p className="text-center text-red-500 mt-4">
           {mensaje}
        </p>
        )
       }
      <div className="text-center mt-8">
         <Link
            href="/login"
            className="text-violet-600 hover:underline"
            >
            Volver al inicio de sesión
         </Link>
      </div>
   </div>
</main>

);

}