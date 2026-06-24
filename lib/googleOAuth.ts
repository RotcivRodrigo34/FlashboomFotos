import {google} from "googleapis";
import {oauth2Client} from "./google";

export async function obtenerTokens(code:string){

  const {tokens}=await oauth2Client.getToken(code);

  oauth2Client.setCredentials(tokens);

  return tokens;

}

export async function obtenerUsuario(){

  const oauth2=google.oauth2({

    version:"v2",

    auth:oauth2Client

  });

  const {data}=await oauth2.userinfo.get();

  return data;

}