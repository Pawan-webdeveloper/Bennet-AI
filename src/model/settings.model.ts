import mongoose ,{ Schema, model } from "mongoose";

interface ISettings{
    ownerId:string
    businessName: string
    supportEmail: string
    knowledge : string
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
}, {timestamps:true})

const Settings = mongoose.models.Settings || model("Settings", settingSchema)

export default Settings