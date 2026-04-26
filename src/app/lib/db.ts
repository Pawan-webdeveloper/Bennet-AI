import { connection, connect } from "mongoose"

const mongo_URL = process.env.MONGODB_URL
if(!mongo_URL){
    console.log("Databse not found")
}

let cache = global.mongoose
if(!cache) {
    cache = global.mongoose= {conn: null, promise: null}
}

const connectDB = async()=> {
    if(cache.conn){
        return cache.conn
    }
    if(!cache.promise){
        cache.promise = connect(mongo_URL!).then((c)=> c.connection)
    }
    try {
        cache.conn = await cache.promise
    } catch (error) {
        console.log(error)
    }

    return cache.conn 
}

export default connectDB