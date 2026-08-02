import mongoose ,{ Schema, model } from "mongoose";

interface ISettings{
    ownerId:string
    businessName: string
    supportEmail: string
    knowledge : string
    iconColor: string
}



const settingSchema = new Schema<ISettings>({
        ownerId:{
            type: String,
            required: true
        },
         businessName:{
            type: String
        },
         supportEmail:{
            type: String
        },
         knowledge:{
            type: String
        },
         iconColor:{
            type: String,
            default: "#000000"
        },
}, {timestamps:true})

const Settings = mongoose.models.Settings || model("Settings", settingSchema)

export default Settings