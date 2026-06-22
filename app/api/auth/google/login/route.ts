import { NextResponse } from "next/server";
import { oauth2Client,GOOGLE_SCOPES } from "@/lib/google";

export async function GET(){

const url=oauth2Client.generateAuthUrl({

access_type:"offline",

prompt:"consent",

scope:GOOGLE_SCOPES

});

return NextResponse.redirect(url);

}