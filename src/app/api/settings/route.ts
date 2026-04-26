import connectDB from "@/app/lib/db";
import Settings from "@/model/settings.model";
import { NextRequest, NextResponse } from "next/server";

export  async function POST(req:NextRequest) {
    
    try {
        const {ownerId, businessName, supportEmail, knowledge} = await req.json()
        
        if(!ownerId) {
            return NextResponse.json(
                {message: "Owner ID is Required"},
                {status: 400}
            )
        }
        await connectDB()
        const settings = await Settings.findOneAndUpdate(
            {ownerId},
            {ownerId, businessName, supportEmail, knowledge},
            {new: true, upsert: true}
        )
        return NextResponse.json(settings)
    } catch (error) {
         return NextResponse.json(
                {message: `setttings error ${error}`},
                {status: 400}
            )
    }
}