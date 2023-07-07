const Blog = require("../models/blogModel")
const User= require("../models/userModel")
const asyncHandler= require("express-async-handler")
const cloudinaryUploadImage = require("../utils/cloudinary")
const fs =require("fs")
const cloudinary = require("cloudinary")

const createBlog = asyncHandler(
    async (req,res) =>{
        try{
            if(req.body.image)
            {
            const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
              folder: "apacher",
              width: 150,
              crop: "scale",
            });
        
            req.body.image = {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            };
            }
            const newBlog = await Blog.create(req.body)
            res.json({
                status:true,
                newBlog
            })
        }
        catch(error){
            throw new Error(error)
        } 
    }
)
const updateBlog = asyncHandler(
    async (req,res) =>{
        try{
            let blog = await Blog.findById(req.params.id)
             if(req.body.newImage)
             {
                await cloudinary.v2.uploader.destroy(blog.image.public_id); 
                const myCloud = await cloudinary.v2.uploader.upload(req.body.newImage, {
                    folder: "apacher",
                    width: 150,
                    crop: "scale",
                  });
              
                  req.body.image = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                  };     
             }
             const b = await Blog.findByIdAndUpdate(req.params.id,req.body,{new:true})
             res.json(b)
        }
        catch(err)
        {
            throw new Error(err)
        }
    }
)
const getOneBlog = asyncHandler(
    async (req,res) =>{
        try{
            const b = await Blog.findByIdAndUpdate(
                req.params.id,{
                  $inc:{numViews:1}
                },{
                    new:true
                }
            ).populate("likes").populate("dislikes")
          

            res.json(b)
        }
        catch(error){
            throw new Error(error)
        }
    }
)
const getAllBlogs = asyncHandler(
    async (req,res) =>{
        try{
            const bs = await Blog.find()
            res.json(bs)  
        }
        catch(err)
        {
            throw new Error(err)
        }
    }
)

const deleteBlog = asyncHandler(
    async (req,res) =>{
        try{
            let blog = await Blog.findById(req.params.id)
            console.log(blog)
            if(blog.image)
            {
            await cloudinary.v2.uploader.destroy(blog.image?.public_id);
            const bs = await Blog.findByIdAndDelete(req.params.id)
            res.json(bs)
            }

            else{
                return next(new ErrorHander("Blog not found",404))    
            }  
        }
        catch(err)
        {
            throw new Error(err)
        }
    }
)

const likeBlog = asyncHandler(
    async (req,res) =>{
        try{
            const {blogId} = req.body
            const blog = await Blog.findById(blogId)
            const ID = req?.user?._id
            const isLiked = blog?.isLiked
        
                const b = await Blog.findByIdAndUpdate(blogId,{
                    isDisliked:false,
                    $pull:{dislikes:ID}
                },{new:true})  
         
            const isAlreadyLiked = blog.likes.find(
                (userId => userId.toString() === ID.toString())
            )
            let B
            if(!isAlreadyLiked){
                B = await Blog.findByIdAndUpdate(
                    blogId,{
                       isDisliked:false,
                       $push:{likes:ID} 
                    },{new:true}
                )
            }
            res.json(B)
        }
        catch(error){
            res.json(error)
        }
    }
)

const dislikeBlog = asyncHandler(
    async (req,res) =>{
        try{
            const {blogId} = req.body
            const blog = await Blog.findById(blogId)
            const ID = req?.user?._id
            const isLiked = blog?.isLiked
                const b = await Blog.findByIdAndUpdate(blogId,{
                    isDisliked:false,
                    $pull:{likes:ID}
                },{new:true})  
            
            const isAlreadyDisLiked = blog.dislikes.find(
                (userId => userId.toString() === ID.toString())
            )
            let B
            if(!isAlreadyDisLiked){
                B = await Blog.findByIdAndUpdate(
                    blogId,{
                       isDisliked:false,
                       $push:{dislikes:ID} 
                    },{new:true}
                )
            }
            res.json(B)
        }
        catch(error){
            res.json(error)
        }
    }
)
const uploadImageBlog = asyncHandler(
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
            const BLOG = await Blog.findByIdAndUpdate(id,{
                "images":urls.map(
                    (file)=>{
                        return file
                    }
                )
            },{
                new:true
            }
            )

         res.json(BLOG)
        }
        catch(err){
            throw new Error(err)
        }
    }
)

module.exports = {uploadImageBlog, likeBlog,createBlog,updateBlog,getOneBlog,getAllBlogs,deleteBlog,likeBlog,dislikeBlog}

