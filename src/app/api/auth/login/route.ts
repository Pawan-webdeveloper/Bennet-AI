import { getScalekit } from "@/app/lib/scalekit";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest) {
    
    const redirectUrl = `${process.env.NEXT_PUBLIC_URL}/api/auth/callback`
   const url = getScalekit().getAuthorizationUrl(redirectUrl)
   console.log(url)
   return NextResponse.redirect(url)
}
