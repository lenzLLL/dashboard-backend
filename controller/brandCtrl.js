const Brand = require("../models/brandModel")
const asyncHandler = require("express-async-handler")

const createBrand = asyncHandler(
    async (req,res) => {
        try{
            const newBrand = await Brand.create(req.body)
            res.json(newBrand)
        }
        catch(error)
        {
            throw new Error(error)
        }
    }
)

const updateBrand = asyncHandler(
    async (req,res) =>{
        try{
            const b = await Brand.findByIdAndUpdate(
                req.params.id,req.body,{new:true}
            )
            res.json(b)
        }
        catch(error)
        {
            throw new Error(error)
        }
    }
)

const deleteBrand = asyncHandler(
    async (req,res) =>{
        try{
            const b = await Brand.findByIdAndDelete(
                req.params.id
            )
            res.json({
                status:"success",
                msg:"brand deleted"
            })
        }
        catch(error)
        {
            throw new Error(error)
        }
    }
)

const getOneBrand = asyncHandler(
    async (req,res) =>{
        try{
            const b = await Brand.findById(
                req.params.id
            )
            res.json(b)
        }
        catch(error)
        {
            throw new Error(error)
        }
    }
)

const getAllBrands = asyncHandler(
    async (req,res) =>{
        try{
            const b = await Brand.find()
            res.json(b)
        }
        catch(error)
        {
            throw new Error(error)
        }
    }
)

module.exports = {getAllBrands, createBrand,updateBrand,deleteBrand,getOneBrand}