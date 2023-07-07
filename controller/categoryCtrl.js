const Category = require("../models/categoryModel")
const asyncHandler = require("express-async-handler")

const createCategory = asyncHandler(
    async (req,res) => {
        try{
            const newCategory = await Category.create(req.body)
            res.json(newCategory)
        }
        catch(error)
        {
            throw new Error(error)
        }
    }
)

const updateCategory = asyncHandler(
    async (req,res) =>{
        try{
            const p = await Category.findByIdAndUpdate(
                req.params.id,req.body,{new:true}
            )
            res.json(p)
        }
        catch(error)
        {
            throw new Error(error)
        }
    }
)

const deleteCategory = asyncHandler(
    async (req,res) =>{
        try{
            const p = await Category.findByIdAndDelete(
                req.params.id
            )
            res.json({
                status:"success",
                msg:"category deleted"
            })
        }
        catch(error)
        {
            throw new Error(error)
        }
    }
)

const getOneCategory = asyncHandler(
    async (req,res) =>{
        try{
            const c = await Category.findById(
                req.params.id
            )
            res.json(c)
        }
        catch(error)
        {
            throw new Error(error)
        }
    }
)

const getAllCategory = asyncHandler(
    async (req,res) =>{
        try{
            const cs = await Category.find()
            res.json(cs)
        }
        catch(error)
        {
            throw new Error(error)
        }
    }
)

module.exports = {getAllCategory, createCategory,updateCategory,deleteCategory,getOneCategory}