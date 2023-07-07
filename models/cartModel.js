const mongoose = require("mongoose")

const cartModel = mongoose.Schema({
  products:[
      {
          product:{
              type:mongoose.Schema.Types.ObjectId,
              ref:"Product"
          },
          count:Number,
          color:String,
          fcfa:Number,
          
      }
  ],
  cartTotal:{
      type:Number,
      required:true
  },

  cartTotalDiscount:{
    type:Number,
    default:0
},

  orderBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
  }
})

module.exports = mongoose.model("Cart",cartModel)