const Product =require("../models/productModel")
const asyncHandler = require("express-async-handler")
const slugify =require("slugify")
const ErrorHander = require("../utils/errorhander")
const fs = require("fs")
const cloudinary = require("cloudinary")
const cloudinaryUploadImage = require("../utils/cloudinary")

const createProduct = asyncHandler(
    async (req,res) =>{
        try{
            let images = []
            if(typeof req.body.images === "string"){
                images.push(req.body.images) 
            }
            else{
                 images = req.body.images
            }
            let imagesString = []
            if(req.body.images)
            {
                for(let i = 0;i<images.length;i++)
                {
                    const result = await cloudinary.v2.uploader.upload(images[i],{
                        folder:"apacher"
                    })
                    imagesString.push(
                        {
                            public_id:result.public_id,
                            url:result.secure_url
                        }
                    )
                }
            }
            req.body.images = imagesString

            if(req.body.title){
                req.body.slug = slugify(req.body.title)
            }
            if(req.body.englishTitle){
                req.body.englishSlug = slugify(req.body.englishTitle)
            }

            const newProduct = await Product.create(req.body)
            res.json(newProduct)
        }
        catch(error){
            throw new Error(error)
        }
    }
)
const getOneProduct = asyncHandler(
    async (req,res) =>{
        try{
            const product = await Product.findById(req.params.id)
            res.json(product)  
        }
        catch(err){
            throw new Error(err)
        }
    }
)
const getAllProductsAdmin = asyncHandler(
    async (req,res) =>{
        try{
            const products = await Product.find()
            res.status(200).json({
                success:true,
                products
            })
        }
        catch(err)
        {
            throw new Error(err)
        }
    }
)
const getAllProducts = asyncHandler(
    async (req,res) =>{
        try{
            const objQuery = {...req.query}
            const deleteElement = ["page","limit","sort","fields"]
            deleteElement.forEach(el=> delete objQuery[el])
            let jsonQuery = JSON.stringify(objQuery)
            jsonQuery = jsonQuery.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`)
            let query = Product.find(JSON.parse(jsonQuery))
            if(req.query.sort){
                const sortBy = req.query.sort.split(",").join(" ")
                query = query.sort(sortBy) 
            }else{
                query = query.sort("-createdAt")
            }
            if(req.query.fields){
               const f = req.query.fields.split(",").join(" ")
               query = query.select(f)
            }
       
            const page = req.query.page
            const limit = req.query.limit
            const skip = limit*(page-1)
            if(req.query.page){
                const c = Product.countDocuments()
                if(skip>=c){
                    throw new Error("page not found")
                }
            }
            query = query.skip(skip).limit(limit)
            const products = await query

            res.json(products)  
        }
        catch(err){
            throw new Error(err)
        }
    }
)

const updateProduct = asyncHandler(
    async (req,res) =>{
        try{
            const product = await Product.findById(req.params.id)
            if(!product)
            {
                return next(new ErrorHander("id du produit incorrect incorrect",404))   
            }
            if(req.body.newImages?.length > 0)
            {
                for (let i = 0; i < product.images.length; i++) {
                    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
                  }
                let images = []
                if(typeof req.body.newImages === "string"){
                    images.push(req.body.newImages) 
                }
                else{
                    images = req.body.newImages
                }
                let imagesString = []
                if(req.body.newImages)
                {
                    for(let i = 0;i<images.length;i++)
                {
                    const result = await cloudinary.v2.uploader.upload(images[i],{
                        folder:"apacher"
                    })
                    imagesString.push(
                        {
                            public_id:result.public_id,
                            url:result.secure_url
                        }
                    )
                }
            }
            req.body.images = imagesString

            }
            if(req.body.title){
                req.body.slug = slugify(req.body.title)
            }
            const p = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true})
            res.json(p)

        }
        catch(err)
        {
            throw new Error(err)
        }
    }
)

const deleteProduct = asyncHandler(
    async (req,res) =>{
        try{
           const p = await Product.findByIdAndRemove(req.params.id)
           res.json({
               message:"Product was deleted successfully!"
           })
        }
        catch(err){
            throw new Error(err)
        }
    }
)

const rating = asyncHandler(
    async (req,res) =>{
        try{
            const {_id} = req.user
            const {star,productId,comment} = req.body
            let product = await Product.findById(productId)
            const isAlreadyRated = product.ratings.find(
                (user=>user.postedBy.toString() === _id.toString())
            )
            if(isAlreadyRated){
                product = await Product.updateOne(
                    {
                        ratings:{$elemMatch:isAlreadyRated}
                    },
                    {
                       $set:{"ratings.$.star":star,"rating.$.comment":comment}
                    },
                    {
                        new:true
                    }
                )
            }
            else{
                product = await Product.findByIdAndUpdate(
                    productId,{
                        $push:{
                            ratings:{
                                star:star,
                                comment:comment,
                                postedBy:_id
                            }
                        }
                    }
                    ,{new:true}
                )
            }
            let PRODUCT = await Product.findById(productId)
            let totalRating = PRODUCT.ratings.length
            let ratingSum = PRODUCT.ratings.map(
                (item) => item.star
            ).reduce((prev,curr)=>prev+curr,0);
            let actualRating = ratingSum/totalRating
            await Product.findByIdAndUpdate(
                productId,{
                    totalRatings:actualRating
                },{
                    new:true
                }
            )
            PRODUCT = await Product.findById(productId)
            res.json(PRODUCT)
        }
        catch(error){
            throw new Error(error)
        }
    }
)

const uploadImage = asyncHandler(
    async (req,res)=>{
        const {id} = req.params
        try{
            const uploader = (path) => cloudinaryUploadImage(path,"images")
            const  urls = []
            const files = req.files
            console.log(files)
            for(const file of files){
                const {path} = file
                const newPath = await uploader(path)
                console.log(newPath)
                urls.push(newPath)
                fs.unlinkSync(path)
            }
            const PRODUCT = await Product.findByIdAndUpdate(id,{
                "images":urls.map(
                    (file)=>{
                        return file
                    }
                )
            },{
                new:true
            }
            )

         res.json(PRODUCT)
        }
        catch(err){
            throw new Error(err)
        }
    }
)
module.exports = {uploadImage, rating,createProduct,getOneProduct,getAllProducts,getAllProductsAdmin, updateProduct,deleteProduct}