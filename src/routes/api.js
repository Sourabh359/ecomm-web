import express from "express"
const router = express.Router();
import Product from "../models/Product.js";
import Category from "../models/Category.js";


router.get('/', (req, res) => {
    res.status(200).send("api");
});

// router.get('/search', (req, res) => {
//     const item = req.query.product;

//     if (typeof item !== "string") {
//         return res.status(400).json({ "message": "product query parameter is required" });
//     }

//     Product.find({ name: new RegExp(item) }).select("-_id")
//         .then(results => {
//             if (results.length) {
//                 return res.status(200).json(results);
//             }
//             res.status(200).json({ "message": "no product found" });
//         })
//         .catch(err => {
//             console.warn(err)
//         });

// });

router.get("/search", async (req, res) => {
     const product = typeof req.query.product === "string"
          ? req.query.product.trim()
          : "";

     if (!product) {
          return res.status(400).render("search.html", {
               title: "Search",
               message: "Please enter a product name.",
               items: []
          });
     }

     try {
          const results = await Product.find({
               name: new RegExp(product, "i")
          }).select("-_id").lean();

          return res.status(200).render("search.html", {
               title: `Search results for "${product}"`,
               items: results,
               message: results.length
                    ? ""
                    : `No products found for "${product}"`
          });

     } catch (err) {
          console.warn("SEARCH ERROR:", err);

          return res.status(500).render("search.html", {
               title: "Search",
               message: "Something went wrong while searching.",
               items: []
          });
     }
});

// router.get('/category',(req,res)=>{
//      const item=req.query.q;

//     if (typeof item !== "string") {
//         return res.status(400).json({ "message": "q query parameter is required" });
//     }

//      Category.find({slug:new RegExp(item)}).select("name slug -_id")
//      .then(results=>{
//          if(results.length){
//            return res.status(200).json(results);
//          }
//          res.status(200).json({"message":"no category found"});
//      })
//      .catch(err=>{
//           console.warn(err)
//      });     
// });

router.get('/category', async (req, res) => {
     try {
          const item = req.query.q;

          let results;

          if (typeof item === "string" && item.trim()) {
               results = await Category.find({
                    slug: new RegExp(item.trim(), "i")
               }).select("name slug -_id");
          } else {
               results = await Category.find({})
                    .select("name slug -_id");
          }

          return res.status(200).json(results);

     } catch (err) {
          console.warn(err);
          return res.status(500).json({
               message: "Failed to fetch categories"
          });
     }
});

// router.get('/products',(req,res)=>{
//      const item=req.query.q;

//     if (typeof item !== "string") {
//         return res.status(400).json({ "message": "q query parameter is required" });
//     }

//      Product.find({name:new RegExp(item)}).select("-_id")
//      .then(results=>{
//          if(results.length){
//            return res.status(200).json(results);
//          }
//          res.status(200).json({"message":"no category found"});
//      })
//      .catch(err=>{
//           console.warn(err)
//      });     
// });

router.get('/products', async (req, res) => {
     try {
          const item = req.query.q;

          let results;

          if (typeof item === "string" && item.trim()) {
               results = await Product.find({
                    name: new RegExp(item.trim(), "i")
               }).select("-_id");
          } else {
               results = await Product.find({})
                    .select("-_id");
          }

          return res.status(200).json(results);

     } catch (err) {
          console.warn(err);
          return res.status(500).json({
               message: "Failed to fetch products"
          });
     }
});

export default router;