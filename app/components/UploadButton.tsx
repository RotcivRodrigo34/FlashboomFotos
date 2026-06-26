"use client";

import { useRef, useState } from "react";

interface Props{

    codigoEvento:string;

    onUploadComplete:()=>void;

}

export default function UploadButton({

    codigoEvento,

    onUploadComplete

}:Props){

  const inputFile = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);

const [mensaje, setMensaje] = useState("");

  async function subirArchivo(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    if (!e.target.files?.length) return;

    const foto = e.target.files[0];
    setSubiendo(true);

setMensaje("");

const formData = new FormData();

formData.append("foto", foto);

formData.append("codigoEvento", codigoEvento);

    const response = await fetch("/api/evento/upload", {
      method: "POST",
      body: formData
    });

const data = await response.json();

console.log(data);

setSubiendo(false);

if(data.ok){

    onUploadComplete();

    setMensaje("✅ ¡Fotografía subida correctamente!");

    setTimeout(()=>{

        setMensaje("");

    },3000);

}else{

    setMensaje("❌ "+data.mensaje);

}

  }

  return (

    <>

      <input
        ref={inputFile}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={subirArchivo}
      />

      <button
        onClick={() => inputFile.current?.click()}
   className={`
w-full
text-white
font-semibold
text-lg
py-4
rounded-full
transition
shadow-lg

${

subiendo

?

"bg-gray-400 cursor-not-allowed"

:

"bg-violet-600 hover:bg-violet-700"

}
`}
      >

        <div className="flex justify-center items-center gap-3">

             <span>

    {

        subiendo

        ?

        "⏳ Subiendo fotografía..."

        :

        "📷 Subir mis fotografías"

    }

</span>

        </div>

      </button>
      {

mensaje && (

<p className="text-center mt-3 text-green-600 text-sm font-medium">

    {mensaje}

</p>

)

}

    </>

  );

}