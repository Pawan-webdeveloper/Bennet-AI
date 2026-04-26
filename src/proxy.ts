
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./app/lib/getSession";

export async function proxy(req:NextRequest) {
    const session = await getSession()
    console.log(session)
    if(!session){
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}`)
    }
    return NextResponse.next()
}

export const config = {
    matcher : '/dashboard/:path*', 
}