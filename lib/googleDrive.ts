import { google } from "googleapis";
import { oauth2Client } from "./google";

export function obtenerDrive() {

  return google.drive({

    version: "v3",

    auth: oauth2Client

  });

}

export async function buscarOCrearCarpetaFlashboom() {

  const drive = obtenerDrive();

  const buscar = await drive.files.list({

    q: "mimeType='application/vnd.google-apps.folder' and name='FlashboomFotos' and trashed=false",

    fields: "files(id,name)"

  });

  if (

    buscar.data.files &&

    buscar.data.files.length > 0

  ) {

    return buscar.data.files[0];

  }

  const carpeta = await drive.files.create({

    requestBody: {

      name: "FlashboomFotos",

      mimeType: "application/vnd.google-apps.folder"

    },

    fields: "id,name"

  });

  return carpeta.data;

}