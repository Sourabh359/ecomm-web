import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";

const db = mongoose.connection;

main().catch(err=>console.log("Database connection failed:",err));

async function main() {

    const mongoUrl = process.env.MONGODB_Data;
    if (!mongoUrl) {
        throw new Error("MONGODB_Data environment variable is required");
    }
    await mongoose.connect(mongoUrl);
    console.log(`${db.name} Database Connected Successfully`);

}

db.on("error" , err=>console.warn("MongoDB Error",err));
db.once("open" , ()=>console.log("Db Open"));

export default mongoose;