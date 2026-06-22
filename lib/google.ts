import { google } from "googleapis";

export const oauth2Client=new google.auth.OAuth2(

process.env.GOOGLE_CLIENT_ID,

process.env.GOOGLE_CLIENT_SECRET,

`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`

);

export const GOOGLE_SCOPES=[

"https://www.googleapis.com/auth/drive.file",

"https://www.googleapis.com/auth/userinfo.email"

];