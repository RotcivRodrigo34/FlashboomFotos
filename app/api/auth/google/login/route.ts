import { NextRequest, NextResponse } from "next/server";
import {
  oauth2Client,
  GOOGLE_SCOPES
} from "@/lib/google";

export async function GET(request: NextRequest) {

  const usuario = request.nextUrl.searchParams.get("usuario");

  const url = oauth2Client.generateAuthUrl({

    access_type: "offline",

    prompt: "consent",

    scope: GOOGLE_SCOPES,

    state: usuario ?? ""

  });

  return NextResponse.redirect(url);

}