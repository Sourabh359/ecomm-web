import express from "express";
import path from "node:path";
import nunjucks from "nunjucks";
import mongoose from "./dao.js";
import apiRouter from "./routes/api.js";
import productRouter from "./routes/product.js";
import Product from "./models/Product.js";
import Category from "./models/Category.js";
import Admin from "./models/Admin.js";
import session from "express-session";
import passport from "passport";
import local from "passport-local";

const LocalStrategy=local.Strategy;



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', 1); 
app.use(session({
    secret:"session",
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    const userRecord = Array.isArray(user) ? user[0] : user;
    done(null, userRecord?.id ?? userRecord?._id ?? null);
});

passport.deserializeUser(function (user, next) {
    next(null, user);
});


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

passport.use( new LocalStrategy({ usernameField: 'username',passwordField:'password' },(username, password, done) => {

      Admin.find({ username: username }).then(( user) => {      

          if( user.length==0 ){
          return done(null, { message: 'No user found!' });
               }
               else  if (user[0].password !== password) {
                    return done(null, { message: 'Password is incorrect!' });
               }
               else{
                    return done(null, user);
               }
       
        return done(null, user);

      });

    }
  ));

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function isAuthenticated(req, res, next) {
      if (req.isAuthenticated()) {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        next();
      } else {
        res.status(403).render('admin.html',{msg:"Forbidden"});
      }
  }

  app.get("/add",isAuthenticated,(req,res)=>{
     res.status(200).render("add.html");
  })


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
     res.status(200).render("admin.html",{ title:"Hello Admin" });
});

app.post("/admin", (req, res, next) => {
  /**
   * @param {any} err
   * @param {any} user
   * @param {any} [info]
   */
  const handleLocalAuth = (err, user, info) => {
    if (err) {
      return next(err);
    }
    else if (!user) {
      return res.render('admin.html', { errorMessage: info?.message ?? 'Invalid credentials', title:"Invalid Credentials" });
    }
    else {
      //setting users in session
      return req.logIn(user, function (loginErr) {
        if (loginErr) {
          return next(loginErr);
        }

        return res.render('add.html', { name: user[0]?.username ?? user.username ?? 'Admin' });
      });
    }
  };

  passport.authenticate('local', handleLocalAuth)(req, res, next);
});

app.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
     else{
          res.status(200).render("admin.html",{title:"Logout"});
     }
  });
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
