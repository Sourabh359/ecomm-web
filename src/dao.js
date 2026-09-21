
import mongoose from "mongoose";

const db = mongoose.connection;

main().catch(err=>console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecomm');
    console.log(`${db.name} Database Connected Successfully`);
    
}

db.on("err" , err=>console.warn(err));
db.once("open" , ()=>console.log("Db Open"));

export default mongoose;