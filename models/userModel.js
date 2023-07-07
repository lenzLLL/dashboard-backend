const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        index:false,    
    },
    email:{
        type:String,
        required:true,
        unique:true,
             
    },
    contact:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        index:false
    },
    isBlocked:{
       type:Boolean,
       default:false
    },
    role:{
        type:String,
        default:"user"
    },
    cart:{
        type:Array,
        default:[]
    },
    address:{
        type:String
    },
    wishlist:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }],
    refreshToken:{
        type:String,
        
    },
    passwordChangedAt:{
        type:Date
    },
    passwordResetToken:{
        type:String
    },
    passwordResetExpires:{
        type:Date
    },
    avatar:
    {
        public_id:{
            type:String,
            default:"avatar"
        },
        url:{
            type:String,
            default:"https://img.freepik.com/free-icon/user_318-159711.jpg?size=338&ext=jpg&ga=GA1.2.765431515.1679580114&semt=ais"
        }
    }


},{
    timestamps:true
})
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }
    const salt = await bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password,salt)

})

userSchema.methods.isPasswordMatched = async function(value){
    return await bcrypt.compare(value,this.password)

}

userSchema.methods.createPasswordToken = async function(value){
    const token = crypto.randomBytes(20).toString("hex")
    this. passwordResetToken = crypto.createHash("sha256").update(token).digest("hex")
    this.passwordResetExpires = Date.now() + 30 * 60 *1000
    return token
}

module.exports = mongoose.model("User",userSchema)