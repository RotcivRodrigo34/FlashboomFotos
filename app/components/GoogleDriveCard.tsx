"use client";

import { useEffect, useState } from "react";

function tiempoRelativo(fecha:string){

  const ahora=new Date().getTime();

  const tiempo=new Date(fecha).getTime();

  const minutos=Math.floor(

    (ahora-tiempo)/60000

  );

  if(minutos<1){

    return "Hace unos segundos";

  }

  if(minutos===1){

    return "Hace 1 minuto";

  }

  if(minutos<60){

    return `Hace ${minutos} minutos`;

  }

  const horas=Math.floor(minutos/60);

  return `Hace ${horas} horas`;

}
interface GoogleDriveData {

  google_email:string;

  drive_folder_root_id:string;

  drive_folder_root_nombre:string;

  drive_total_storage:number|null;

  drive_used_storage:number|null;

  ultima_sincronizacion:string;

  conectado:boolean;

}

export default function GoogleDriveCard() {

  const [datos, setDatos] = useState<GoogleDriveData | null>(null);
  const [cargando,setCargando]=useState(true);
  const [error,setError]=useState("");

  const usuarioID =
    typeof window !== "undefined"
      ? localStorage.getItem("usuarioID")
      : null;

useEffect(() => {

    if (!usuarioID) return;

async function cargarDrive(){

    try{

        setCargando(true);

        const response=await fetch(
            `/api/dashboard/google-drive?usuario=${usuarioID}`
        );

const data = await response.json();

console.log("Respuesta API:", data);

if (data.error) {

    setError(data.error);

    return;

}

setDatos(data);

    }
    catch(err){

        console.log(err);

        setError("No fue posible cargar Google Drive.");

    }
    finally{

        setCargando(false);

    }

}

cargarDrive();

}, [usuarioID]);

if(cargando){

    return(

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

            Cargando Google Drive...

        </div>

    );

}

if(error){

    return(

        <div className="bg-red-50 border border-red-200 rounded-3xl p-8">

            {error}

        </div>

    );

}

  // ------------------------------

  // NO CONECTADO

  // ------------------------------

if (!datos || !datos.conectado) {

    return (

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-3">

            <span className="text-3xl">

              ☁️

            </span>

            <h2 className="text-2xl font-bold">

              Google Drive

            </h2>

          </div>

          <div className="flex items-center gap-2">

            <div className="w-3 h-3 rounded-full bg-red-500"></div>

            <span className="font-semibold">

              No conectado

            </span>

          </div>

        </div>

        <p className="text-gray-500 mt-8 leading-7">

          Conecta tu cuenta de Google Drive para que las fotografías de tus invitados se almacenen directamente en tu nube.

        </p>

        <div className="flex justify-end mt-8">

          <button

            onClick={() => {

              window.location.href =
                `/api/auth/google/login?usuario=${usuarioID}`;

            }}

            className="bg-violet-600 hover:bg-violet-700 transition text-white px-6 py-3 rounded-2xl"

          >

            Conectar Google Drive

          </button>

        </div>

      </div>

    );

  }

  // ------------------------------

  // CONECTADO

  // ------------------------------

  return (

    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

      <div className="flex justify-between items-center">

        <div className="flex items-center gap-3">

          <span className="text-3xl">

            ☁️

          </span>

          <h2 className="text-2xl font-bold">

            Google Drive

          </h2>

        </div>

        <div className="flex items-center gap-2">

          <div className="w-3 h-3 rounded-full bg-green-500"></div>

          <span className="font-semibold">

            Conectado

          </span>

        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-10">

        <div>

          <p className="text-gray-400 text-sm">

            Cuenta

          </p>

          <p className="font-semibold break-all">

            {datos.google_email}

          </p>

        </div>

        <div>

          <p className="text-gray-400 text-sm">

            Carpeta raíz

          </p>

          <p className="font-semibold">

            {datos.drive_folder_root_nombre}

          </p>

        </div>

        <div>

          <p className="text-gray-400 text-sm">

            Espacio

          </p>

<div>

<div className="w-full bg-gray-200 rounded-full h-3 mt-2">

<div

className="bg-violet-600 h-3 rounded-full"

style={{

width:`${

datos.drive_total_storage

?

((datos.drive_used_storage??0)/datos.drive_total_storage)*100

:

0

}%`

}}

>

</div>

</div>

<p className="mt-2">

{datos.drive_used_storage??0}

MB /

{" "}

{datos.drive_total_storage??15}

GB

</p>

</div>

        </div>

        <div>

          <p className="text-gray-400 text-sm">

            Última sincronización

          </p>

<p>

{

tiempoRelativo(

datos.ultima_sincronizacion

)

}

</p>

        </div>

      </div>

      <div className="flex justify-end gap-4 mt-10">

 <button

onClick={()=>{

window.open(

`https://drive.google.com/drive/folders/${datos.drive_folder_root_id}`,

"_blank"

);

}}

className="border border-gray-300 hover:bg-gray-100 transition px-6 py-3 rounded-2xl"

>

Abrir carpeta

</button>

<button

onClick={()=>{

window.location.href=

`/api/auth/google/login?usuario=${usuarioID}`;

}}

className="bg-violet-600 hover:bg-violet-700 transition text-white px-6 py-3 rounded-2xl"

>

Reconectar

</button>

      </div>

    </div>

  );

}