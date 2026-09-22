import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    //  _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    mrp: { type: Number, required: true, min: 1, max: 9999999 },
    discount: { type: Number, required: false, min: 0, max: 100 },
    ratings: { type: Number, required: true, min: 0, max: 5 },
    img:Object,
}, { collection: "product" });

const Product = mongoose.model("Product", ProductSchema);

export default Product;