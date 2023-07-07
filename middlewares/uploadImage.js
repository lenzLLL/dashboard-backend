const sharp = require("sharp")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

const multerStorage = multer.diskStorage(
    {
        destination:function(req,file,cb){
            cb(null,path.join(__dirname,"../public/apacher"))
        },
        filename:function(req,file,cb){
            const uniqueSuffix = Date.now()+"-"+Math.round(Math.random())
            cb(null,file.fieldname+"-"+uniqueSuffix+".jpeg")  
        }
    }
)

const multerFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith("image")){
       cb(null,true)
    }
    else{
        cb(
            {
                message:"unsupported file format"
            },
            false
        )
    }
}
const productsImagesResize = async (req,res,next) =>{
    if(!req.files) return next();
    await Promise.all(
        req.files.map(async (file)=>{
            await sharp(file.path).resize(300,300).toFormat("jpeg").jpeg({quality:90}).toFile(`public/apacher/products/${file.filename}`)
            fs.unlinkSync(`public/apacher/products/${file.filename}`)
        })
    )
    next()
}

const blogImagesResize = async (req,res,next) =>{
    if(!req.files) return next();
    await Promise.all(
        req.files.map(async (file)=>{
            await sharp(file.path).resize(300,300).toFormat("jpeg").jpeg({quality:90}).toFile(`public/apacher/blogs/${file.filename}`)
            fs.unlinkSync(`public/apacher/blogs/${file.filename}`)
            
        })
    )
    next()
}
const uploadPhoto = multer(
    {
        storage:multerStorage,
        fileFilter:multerFilter,
        limits:{fieldSize:2000000}
    }
)

module.exports = {uploadPhoto,productsImagesResize,blogImagesResize}