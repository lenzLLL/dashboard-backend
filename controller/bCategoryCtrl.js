const BCategory = require("../models/blogCategoryModel")
const asyncHandler = require("express-async-handler")

const createCategory = asyncHandler(
    async (req,res) => {
        try{
            const newCategory = await BCategory.create(req.body)
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
            const p = await BCategory.findByIdAndUpdate(
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
            const p = await BCategory.findByIdAndDelete(
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
            const c = await BCategory.findById(
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
            const cs = await BCategory.find()
            res.json(cs)
        }
        catch(error)
        {
            throw new Error(error)
        }
    }
)

module.exports = {getAllCategory, createCategory,updateCategory,deleteCategory,getOneCategory}