const mongoose = require("mongoose")

const orderModel = new mongoose.Schema(
    {
        products : [
            {
                product:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Product"
                },
                count:Number,
                color:String,
                fcfa:Number
            
            }
        ],
        paymentIntent:{
            id:String,
            method:String,
            amount:Number,
            created:Date,
            currency:String
        },
   
        orderStatus:{
            type:String,
            default:"Not Processed",
            enum:[
                "Not Processed",
                "Cash Before Delivery",
                "Processing",
                "Dispatched",
                "Canceled",
                "Delivered"
            ]

        },
     
        orderBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }

    },{
        timestamps:true
    }
)

module.exports = mongoose.model("Order",orderModel)