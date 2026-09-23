import mongoose from "mongoose";
const Schema=mongoose.Schema;

const CategorySchema=new Schema({
     name:{type:String, required:true, trim:true, unique:true, dropdups:true,  minlength:2, maxlength:20},
     slug:{type:String, required:true, trim:true, unique:true, dropdups:true,  minlength:2, maxlength:20},
},{collection:"categories"});

const Category=mongoose.model("Category",CategorySchema);

export default Category;