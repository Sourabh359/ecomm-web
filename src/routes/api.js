import express from "express"
const router = express.Router();
import Product from "../models/Product.js";


router.get('/', (req, res) => {
    console.log("api");
    res.status(200).send("api");
});

router.get('/search', (req, res) => {
    const item = req.query.product;

    if (typeof item !== "string") {
        return res.status(400).json({ "message": "product query parameter is required" });
    }

    Product.find({ name: new RegExp(item) }).select("name -_id")
        .then(results => {
            if (results.length) {
                return res.status(200).json(results);
            }
            res.status(200).json({ "message": "no product found" });
        })
        .catch(err => {
            console.warn(err)
        });

});

export default router;