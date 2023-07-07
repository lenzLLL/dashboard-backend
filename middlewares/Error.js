const ErrorHandler = require("../utils/errorhander")


module.exports = (err,req,res,next) =>{
err.statusCode = err.statusCode || 500
err.message = err.message||"internal server error"
if(err.name === "CastError")
{
    const message = "resource not found "+err.path
    err = new ErrorHandler(message,400)
}
if(err.code === 11000)
{
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
    err = new ErrorHandler(message,400)
}
if(err.name === "JsonWebTokenError")
{
    const message = "le json web token est invalide s'il vous plait essayez encore"
    err = new ErrorHandler(message,400)
}
if(err.name === "JsonWebTokenExpireError")
{
    const message = "le json web token est expiré"
    err = new ErrorHandler(message,400)
}
res.status(err.statusCode).json({
    success:false,
    message:err.message
})
}