import express from "express";
import path from "node:path";
import nunjucks from "nunjucks";
import mongoose from "./dao.js";
import apiRouter from "./routes/api.js";
import productRouter from "./routes/product.js";
import Product from "./models/Product.js";
import Category from "./models/Category.js";



const app = express();
const port = process.env.PORT || 8080;


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
