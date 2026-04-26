import connectDB from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Settings from "@/model/settings.model";

export async function POST(req:NextRequest) {
    try {
        const { ownerId } = await req.json()
        if(!ownerId) {
            return NextResponse.json(
                {message: "Owner ID is Required"},
                {status: 400}
            )
        }
        await connectDB()
        const settings = await Settings.findOne(
            {ownerId}
            
        )
        if (!settings) {
            return NextResponse.json(
                {businessName: "", supportEmail: "", knowledgeBase: ""},
                {status: 200}
            )
        }
        return NextResponse.json(settings)
    } catch (error) {
         return NextResponse.json(
                {message: `get setttings error ${error}`},
                {status: 400}
            )
    }
}