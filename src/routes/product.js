import express from "express";
const router=express.Router();
import Product from "../models/Product.js";


router.get('/',(req,res)=>{
    res.status(200).render("products.html",{title:"products"});
});

router.get('/:pname',(req,res)=>{
     
     const item=req.params.pname.replaceAll("-"," ");

      Product.find({name:item}).populate("category","name").select("-_id")
          .then(results=>{
               console.log( results);  
               //  return res.status(200).json(results);
               res.status(200).render("product.html",{product:results[0]});
         
          })
          .catch(err=>{
               // console.warn(err);
               //   res.status(200).json(err);
                res.status(200).render("product.html",{});
          });
     
});

export default router;