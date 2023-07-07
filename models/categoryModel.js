const mongoose = require("mongoose")

const categorySchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true
    }
}
,{
    timestamps:true
}
)

module.exports = mongoose.model("CategoryProduct",categorySchema)