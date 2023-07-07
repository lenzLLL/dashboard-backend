const Coupon = require("../models/couponModel")
const asyncHandler = require("express-async-handler")

const createCoupon = asyncHandler(
    async (req,res) =>{
        try{
             const coupon = await Coupon.create(req.body)
             res.json(coupon)
        }
        catch(error){
            throw new Error(error)
        }
    }
)

const getAllCoupons = asyncHandler(
    async (req,res) =>{
        try{
             const coupon = await Coupon.find()
             res.json(coupon)
        }
        catch(error){
            throw new Error(error)
        }
    }
)

const updateCoupon = asyncHandler(
    async (req,res) =>{
        try{
             const coupon = await Coupon.findByIdAndUpdate(req.params.id,req.body,{new:true})
             res.json(coupon)
        }
        catch(error){
            throw new Error(error)
        }
    }
)

const getOneCoupon = asyncHandler(
    async (req,res) =>{
        try{
             const coupon = await Coupon.findById(req.params.id)
             res.json(coupon)
        }
        catch(error){
            throw new Error(error)
        }
    }
)


module.exports = {createCoupon,getAllCoupons,updateCoupon,getOneCoupon}