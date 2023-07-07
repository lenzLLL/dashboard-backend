const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,   
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    slug:{
        type:String,
        lowercase:true,
        unique:true,
        required:true
    },
    providerPrice:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    }
    ,
    provider:{
        type:String,
        required:true
    }
   
    ,images:[
        {
            public_id:{
                type:String,
        
            },
            url:{
                type:String,
            }
        }
    ],
    colors:[],
    brand:{
        type:String,
        required:true
    },
 
    benefice:{
       type:Number,
       required:true
    },
  
    ratings:[{
        star:Number,
        comment:String,
        postedBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    }],

    sold:{
        type:String,
        default:0
    },
    height:[],
    inStock:{
      type:Boolean,
      default:true  
    },
    genre:{
        type:String,
        default:null
    },
    totalRatings:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})

module.exports = mongoose.model("Product",productSchema)