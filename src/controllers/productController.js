import { Product } from "../models/productSchema.js";
import { User } from "../models/userSchema.js";
import { ApiFeatures } from "../utils/apiFeatures.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { customError } from "../utils/customError.js";
import fs from 'fs'
import { deleteImageHelper, uploadImagesHelper } from "../utils/uploadImages.js";



// CREATE PRODUCT 
export const createProduct = asyncErrorHandler(async (req, res, next) => {
    // take input from the user
    const { name, description, category, gender, price, size, photo } = req.body;

    // validating the input    
    if (!name | !description | !category | !gender | !price | !size) {
        const err = new customError("Please provide all the fields", 400);
        return next(err);
    }

    if (!photo) {
        const err = new customError("Please upload photo", 400);
        return next(err);
    }

    let sizeStockValues = JSON.parse(size);

    let arrValues = [];
    for (let key in sizeStockValues) {
        arrValues.push(sizeStockValues[key]);
    }
    let totalStock = arrValues.reduce((acc, current) => acc + current, 0);



    const imageData = await uploadImagesHelper(photo);



    // create product into the database
    const productData = await Product.create({
        name,
        description,
        category: category.toLowerCase(),
        gender,
        price: Number(price),
        stock: totalStock,
        size: sizeStockValues,
        photo: imageData?.map((val) => val)
    })

    res.status(201).json({
        success: true,
        message: "product created successfully",
        productData
    })
})

// GET ALL PRODUCT 
export const getAllProducts = asyncErrorHandler(async (req, res, next) => {

    // total products per page
    const productPerPage = process.env.PRODUCT_PER_PAGE;

    // creating reusable class for filtering, sorting, fields limit, search, paginate
    const apiFeatures = new ApiFeatures(Product.find(), req.query).filter().search().sort().fields();

    // get filtered products
    const filteredProducts = await apiFeatures.query;;

    // paginate on filtered products
    apiFeatures.pagination(productPerPage);

    // get total product from the database
    const allProducts = await apiFeatures.query.clone();

    // calculate totalpages
    const totalPages = Math.ceil(filteredProducts.length / productPerPage);

    res.status(200).json({
        success: true,
        length: allProducts.length,
        totalPages : totalPages,
        productPerPage : Number(productPerPage),
        filteredProducts : filteredProducts.length,
        Products : filteredProducts,
        allProducts,
    })
})

// GET ALL CATEGORIES

export const getAllCategories = asyncErrorHandler(async (req, res, next) => {
    const allCategories = await Product.distinct("category");
    res.status(200).json({
        success: true,
        allCategories
    })
})

// GET SINGLE CATEGORY PRODUCTS

export const getSingleCategoryProducts = asyncErrorHandler(async (req, res, next) => {
    const gender = req.params.gender;
    
    const getProducts = await Product.find({ gender });
    if (!getProducts) {
        const err = new customError("products not found", 404);
        return next(err);
    }

    res.status(200).json({
        length: getProducts.length,
        success: true,
        getProducts
    })
})

// GET SINGLE PRODUCT 
export const getSingleProduct = asyncErrorHandler(async (req, res, next) => {

    const id = req.params.id;


    const singleProduct = await Product.findById(id).populate({ path: 'reviews.user', select: 'name' });

    // check product exists in database or not
    if (!singleProduct) {
        const err = new customError('product not found', 404);
        return next(err);
    }

    res.status(200).json({
        success: true,
        singleProduct
    })
})

// DELETE PRODUCT 
export const deleteProduct = asyncErrorHandler(async (req, res, next) => {

    const id = req.params.id;

    const productExists = await Product.findById(id);
    // check product exists in database or not
    if (!productExists) {
        const err = new customError("product not found", 404);
        return next(err);
    }

    // deleting the product


    await deleteImageHelper(productExists.photo.map((val) => val.public_id));
    await Product.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "product delete succesfully"
    })
})


// UPDATE PRODUCT 
export const updateProduct = asyncErrorHandler(async (req, res, next) => {

    const { name, description, category, gender, price, size, photo } = req.body;

    const id = req.params.id;

    const productExists = await Product.findById(id);
    // check product exists in database or not
    if (!productExists) {
        const err = new customError("product not found", 404);
        return next(err);
    }
    // updating the product
    let sizeStockValues = JSON.parse(size);

    let arrValues = [];
    for (let key in sizeStockValues) {
        arrValues.push(sizeStockValues[key]);
    }
    let totalStock = arrValues.reduce((acc, current) => acc + current, 0);

    const imageData = await uploadImagesHelper(photo);

    await deleteImageHelper(productExists.photo.map((val) => val.public_id));

    await Product.findByIdAndUpdate(id, {
        name,
        description,
        category: category.toLowerCase(),
        gender,
        price: Number(price),
        stock: totalStock,
        size: sizeStockValues,
        photo: imageData?.map((val) => val)
    }, { new: true });
    res.status(200).json({
        success: true,
        message: "product updated succesfully",
    })
})


// GET PRODUCT REVIEWS

export const getProductReview = asyncErrorHandler(async (req, res, next) => {
    const id = req.params.id;

    const product = await Product.findById(id);

    res.status(200).json({
        success: true,
        review: product.reviews
    })
})


// ADD/UPDATE PRODUCT REVIEWS

export const addProductReview = asyncErrorHandler(async (req, res, next) => {


    const id = req.params.id;

    const review = {
        user: req.user._id,
        comment: req.body.comment,
        rating: Number(req.body.rating)
    }

    const product = await Product.findById(id);

    const isReviewed = product.reviews.find((el) => el.user.toString() === req.user._id.toString());
    if (isReviewed) {
        isReviewed.comment = req.body.comment,
            isReviewed.rating = Number(req.body.rating)
    } else {
        product.reviews.push(review);
    }

    let avg = 0

    product.reviews.forEach((el) => {
        avg += el.rating;
    })

    product.ratings = avg / product.reviews.length




    await product.save();

    res.status(200).json({
        success: true,
        message: "product review successfull"
    })

})



