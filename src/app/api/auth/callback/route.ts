import { scalekit } from '@/app/lib/scalekit';

import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    if (!code) {
        return NextResponse.json({ message: "No code found" }, { status: 400 })
    }
    const session = await scalekit.authenticateWithCode(code, `${process.env.NEXT_PUBLIC_URL}/api/auth/callback`);
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}`)
    console.log(session)
    response.cookies.set('access_token', session.accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
    })

    return response
}