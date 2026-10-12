import express from "express";
import path from "node:path";
import nunjucks from "nunjucks";
import mongoose from "./dao.js";
import apiRouter from "./routes/api.js";
import productRouter from "./routes/product.js";
import Product from "./models/Product.js";
import Category from "./models/Category.js";
import jwt from "jsonwebtoken";
import authenticate from "./jwtauth.js";



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8080;
const jwtSecret = process.env.JWT_SECRET || "dev-secret";


app.use(express.static(path.resolve("src/public")));
app.use(express.static(path.resolve("node_modules/bootstrap/dist")));
app.use("/api", apiRouter);
app.use("/products", productRouter);


nunjucks.configure(path.resolve('src/public/views'), {
     express: app,
     autoescape: true,
     noCache: false,
     watch: true
});


app.get("/", (req, res) => {
     res.status(200).render("index.html", { title: "Ecomm" });
});

app.get("/about", (req, res) => {
     res.status(200).render("about.html", {
          title: "about Us",
     });
});

app.get("/contact", (req, res) => {
     res.status(200).render("contact.html", { title: "Contact US" });
});

app.get("/signup", (req, res) => {
     res.status(200).render("signup.html", {
          title: "signup",
     });
});

app.get("/search", async (req, res) => {
     const product = typeof req.query.product === "string"
          ? req.query.product.trim()
          : "";

     try {
          const results = await Product.find({
               name: new RegExp(product, "i")
          })
          .select("-_id")
          .lean();

          return res.render("search.html", {
               title: "Search Results",
               items: results
          });

     } catch (err) {

          return res.status(500).render("search.html", {
               title: "Search",
               items: []
          });
     }
});

app.get("/admin",(req,res)=>{
     res.status(404).render("admin.html",{ title:"Hello Admin" });
});

app.post("/admin",(req,res)=>{

      const { email, pass } = req.body;

      if( email=="a@b" && pass==123456){
          const token=jwt.sign({
                id: 1,
                email,
                role: 'Admin'
            },
             jwtSecret ,
             {
                expiresIn: '1h'
            }
          );

          res.cookie("token", token, {
               httpOnly: true,
               sameSite: "lax",
               maxAge: 60 * 60 * 1000
          });

          // return res.json({message: 'Login Successful',token});
          // return res.status(200).json({message:"success",token, decode:jwt.verify(token,process.env.JWT_SECRET)});
          return res.status(200).render('add.html',{title:"Add Products",message:"success",token, decode:jwt.verify(token,jwtSecret)});
      }

      res.status(401).json({ message: 'Invalid Email or Password'});
     //  res.status(404).render("admin.html",{ title:"Hello Admin" });
});

app.get("/add", authenticate ,(req,res)=>{
     res.status(404).render("add.html",{ title:"Add Products" });
});

app.get("/:cat", async (req, res) => {
     const category = await Category.findOne({ slug: req.params.cat });

     if (!category) {
          return res.status(404).render("error.html", { title: "Page Not Found" });
     }

     try {
          const products = await Product.find({ category: category._id })
               .populate("category")
               .select("-_id")
               .lean();

          return res.status(200).render("category.html", { title: "Category", data: products });
     } catch (err) {
          return res.status(500).render("error.html", { title: "No Product Found" });
     }
});


app.get('/*splat', (req, res) => {
     res.status(404).render("error.html", { title: "Page Not Found" });
});

app.listen(port, () => console.log(`App running at http://127.0.0.1:${port}`));
