import express from 'express'
import { multipleUpload } from '../middlewares/multer.js';
import { createProduct, deleteProduct, getAllProducts, getAllCategories, getSingleProduct, updateProduct, getProductReview, addProductReview, getSingleCategoryProducts } from '../controllers/productController.js';
import { authentication, authorization } from '../middlewares/authentication.js';



const router = express.Router();

router.post("/create-product",authentication, authorization, multipleUpload, createProduct)
.get("/get-all-products",authentication, getAllProducts)
.get("/get-category-products/:gender", getSingleCategoryProducts)
.get("/get-all-categories", getAllCategories)
.get("/product-review/:id",getProductReview)
.put("/product-review/:id", authentication, addProductReview)
.get("/:id", getSingleProduct)
.delete("/:id",authentication, authorization, deleteProduct)
.put("/:id", authentication, authorization, multipleUpload ,updateProduct)


export default router;