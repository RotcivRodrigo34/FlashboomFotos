export async function buscarOCrearCarpetaEvento(

    accessToken:string,

    carpetaPadre:string,

    nombreEvento:string

)

{

    // Buscar carpeta

    const buscar=await fetch(

        `https://www.googleapis.com/drive/v3/files?q=`+

        encodeURIComponent(

            `'${carpetaPadre}' in parents and name='${nombreEvento}' and mimeType='application/vnd.google-apps.folder' and trashed=false`

        ),

        {

            headers:{

                Authorization:`Bearer ${accessToken}`

            }

        }

    );

    const resultado=await buscar.json();

    if(resultado.files?.length){

        return resultado.files[0];

    }

    // Crear carpeta

    const crear=await fetch(

        "https://www.googleapis.com/drive/v3/files",

        {

            method:"POST",

            headers:{

                Authorization:`Bearer ${accessToken}`,

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                name:nombreEvento,

                mimeType:"application/vnd.google-apps.folder",

                parents:[carpetaPadre]

            })

        }

    );

    return await crear.json();

}
export async function subirArchivoDrive(

    accessToken:string,

    carpetaID:string,

    archivo:File

){

    const metadata={

        name:archivo.name,

        parents:[carpetaID]

    };

    const form=new FormData();

    form.append(

        "metadata",

        new Blob(

            [JSON.stringify(metadata)],

            {type:"application/json"}

        )

    );

    form.append(

        "file",

        archivo

    );

    const response=await fetch(

        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink",

        {

            method:"POST",

            headers:{

                Authorization:`Bearer ${accessToken}`

            },

            body:form

        }

    );

    return await response.json();

}