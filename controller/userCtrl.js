const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const { find } = require("../models/userModel")
const { generateToken } = require("../config/jsWebToken")
const { generateRefreshToken } = require("../config/refreshToken")
const crypto = require("crypto")
const ErrorHander = require("../utils/errorhander")
const jwt = require("jsonwebtoken")
const sendEmail = require("./emailCtrl")
const Cart = require("../models/cartModel")
const Product = require("../models/productModel")
const Coupon = require("../models/couponModel")
const Order= require("../models/orderModel")
const uniqid = require("uniqid")
const sendToken = require("../utils/JWT")

const createUser = asyncHandler(
    async (req,res) =>{
        const {email,name,password,contact,language} = req.body
        const findUser = await User.findOne({email:email})
        let myCloud = null
        if(req.body.avatar)
        {
            myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder: "avatars",
                width: 150,
                crop: "scale",
            });
        }
        if(!email||!name||!password||!contact )
        {
              return res.json({
                msg:"veillez fournir toutes les informations au préalable",
                success:false
            })
        }
        if(!findUser)
        {
            const user = await User.create({
                name:name,
                password:password,
                contact:contact,
                email:email,
                avatar:{
                    public_id: myCloud? myCloud.public_id:"avatar",
                    url: myCloud? myCloud.secure_url:"https://img.freepik.com/free-icon/user_318-159711.jpg?size=338&ext=jpg&ga=GA1.2.765431515.1679580114&semt=ais",
                }
            })
            const token =    jwt.sign({id:user._id},process.env.JWT_SECRET,{
                expiresIn: process.env.JWT_EXPIRE
            })
            res.status(201).json({
              success: true,
              user,
              token,
            });
        }   
        else{
           throw new Error("Cet utilisateur existe déjà")
        }    
    }
)
const loginUserCtrl = asyncHandler(
    async(req,res)=>{
        const {email,password} = req.body
        console.log("coll")
        const findUser = await User.findOne({email:email})
        if(findUser && await findUser.isPasswordMatched(password))
        {
            const token = await generateRefreshToken(findUser?._id)
            const updatedUser = await User.findByIdAndUpdate(findUser._id,{
                refreshToken:token
            },{new:true})
            const t =    jwt.sign({id:findUser._id},process.env.JWT_SECRET,{
                expiresIn: process.env.JWT_EXPIRE
            })
            
            
            sendToken(findUser,201,res)

        }
        else{
            throw new Error("Invalid Crédential")
        }

    }
)
const getAllUsers = asyncHandler(
    async (req,res)=>{
        try{
           const users= await User.find()
           res.json(users)
        }
        catch(error){
            throw new Error(error)
        }
    }
)
const forgetPassword = asyncHandler(
    async (req,res)=>{
      const {email} = req.body
      const user = await User.findOne({email})
      if(!user){
          throw new Error("no user found")
      }
      try{
          const token = await user.createPasswordToken()
          await user.save();
          const urlLink = `s'il vous plait cliquez sur ce lien pour réinitialiser votre mot de passe! <a href = 'http://localhost:8080/api/user/resetpassword/${token}'>Cliquez ici</a>`
          const data = {
          to:email,
          text:"Hello my friend",
          subject:"Mot de passe oublié",
          htm:urlLink
          }
          sendEmail(data)
          
          res.json(token)
      }   
      catch(error){
         throw new Error(error)
      }  
    }
)
const getOneUser = asyncHandler(
    async (req,res)=>{
        try{
           const user = await User.findById(req.params.id)
           res.json(user)
        }
        catch(error)
        {
            throw new Error(error)
        }
    }
)
const deleteUser = asyncHandler(
    async (req,res) =>{
        try{
           const user = await User.findByIdAndDelete(req.params.id)
           res.json(user)
        }
        catch(error)
        {
            throw new Error(error)
        }
    }
)
const updateUser = asyncHandler(
    async (req,res)=>{
        try{
           if(req.params.id !== req.user._id && req.user.role !== "admin")
           {
               return res.json({
                   msg:"vous n'avez pas d'autorisation pour effectuer cette action !!",
                   success:false
               })
           }
           const updateUser = await User.findByIdAndUpdate(req.params.id,{name:req.body.name,email:req.body.email,contact:req.body.contact},{new:true})
           res.json(updateUser)
        }
        catch(error)
        {
            throw new Error(error)
        }
    }
)
const blockUser = asyncHandler(
    async (req,res,next)=>{
        try{
           const block = await User.findByIdAndUpdate(req.params.id,{
               isBlocked:true
           },
           {
               new:true
           }
           )
           res.json({
            msg:`${block?.name} a été bloqué`
        })
        }
        catch(error)
        {
            throw new Error(error)
        }
    }
)
const unBlockUser = asyncHandler(
    async (req,res,next)=>{
        try{
            const unBlock = await User.findByIdAndUpdate(req.params.id,{
                isBlocked:false
            },
            {
                new:true
            }
            )
            res.json({
                msg:`${unBlock?.name} a été débloqué`
            })
         }
         catch(error)
         {
             throw new Error(error)
         }
    }
)
const handleRefreshToken = asyncHandler(
    async (req,res) =>{
        if(!req.cookies.refreshToken){
            throw new Error("no refresh token")
        }
        const refreshToken = req.cookies.refreshToken
        const user = await User.findOne({refreshToken})
        if (!user) {throw new Error("no refresh token found in data base")}
        jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{

            if (err || decoded.id !== user.id){
                throw new Error("there is something wrong with refreshToken")
            }
            else{
                const Tk = generateToken(user._id);
                res.json({Tk})
            }
        })

    }
)
const logout = asyncHandler(
    async (req,res)=>{
        console.log("cool")
        res.clearCookie("refreshToken")
        return res.sendStatus(204)

    }
)
const updatePassword = asyncHandler(
     async (req,res)=>{
         const {_id} = req.user
         const {password} = req.body
         const user = await User.findById(_id)
         if(password){
             user.password = password
             const updatedPassword = await user.save()
             res.json(updatedPassword)
         }
         else{
             res.json(user)
         }
     }
)
const resetPasswordToken = asyncHandler(
    async (req,res)=>{
        const {password} = req.body
        const {token} = req.params
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
        const user = await User.findOne({passwordResetToken:hashedToken,passwordResetExpires:{$gt:Date.now()}})
        if(!user){
            throw new Error("votre token de réinitialisation a expiré")
        }
        user.password = password
        user.passwordResetToken =undefined
        user.passwordResetExpires = undefined
        await user.save()
        res.json(user)
        
    }
)
const addToWishList = asyncHandler(
    async (req,res) =>{
        try{
            const {_id} = req.user;
            const {productId} = req.body;
            let user= await User.findById(_id)
            const isAlreadyWished = user?.wishlist.find(
                (Id=>Id.toString() === productId.toString())
            )
            if(isAlreadyWished){
               user = await User.findByIdAndUpdate(_id,{
                   $pull:{wishlist:productId}
               },{new:true})
            }
            else{
                user = await User.findByIdAndUpdate(_id,{
                    $push:{wishlist:productId}
                },{new:true})
            }
            res.json(user)
        }
        catch(error){
            throw new Error(error)
        }
    }
)
const loginAdmin = asyncHandler(
    async (req,res,next) =>{
        try{
            const {email,password} = req.body;
            const USER = await User.findOne({email})
            let token = null;
            if(USER && await USER.isPasswordMatched(password))
            {
                token = await generateRefreshToken(USER?._id)

    
            }
            else{
                return next(new ErrorHander("Email ou mot de passe incorrect",400))

            }
            if(USER.role !== "admin"){
                return next(new ErrorHander("Autorisé seulement aux administrateurs",400))
            }
            else{
                const updatedUser = await User.findByIdAndUpdate(USER._id,{
                    refreshToken:token
                },{new:true})
                res.cookie("refreshToken",token,{
                    httpOnly:true,
                    maxAge:77*60*60*1000
                })
                res.json({
                   _id:USER?._id,
                   name:USER?.name,
                   contact:USER?.contact,
                   password:USER?.password,
                   token:generateToken(USER._id)
                })
            }

        }
        catch(error)
        {
            throw new Error(error)
        }
    }
)
const getWishList = asyncHandler(
    async (req,res) =>{
        try{
             const USER = await (await User.findById(req.user._id)).populate("wishlist")
             res.json(USER.wishlist)
    
            
        }
        catch(error){
            throw new Error(error)
        }
    }
)
const saveAddress = asyncHandler(
    async (req,res) =>{
        try{
            const USER = await User.findByIdAndUpdate(req.user._id,{
                address:req.body?.address
            },{new:true})
            res.json(USER)
        }
        catch(error){
            throw new Error(error)
        }
    }
)
const createCart = asyncHandler(
    async (req,res,next) =>{
        try{
            const {cart} = req.body;
            const {_id} = req.user
            let products = []
            const user = await User.findById(_id)
            const alreadyExist = await Cart.findOne({orderBy:_id})
            if(alreadyExist)
            {
                const r = await alreadyExist.remove()
                res.json(r)
            }
            for(let i = 0;i<cart.length;i++){
                const object = {}
                object.product = cart[i]._id
                object.count = cart[i].count
                object.color = cart[i].color
                let price = await Product.findById(cart[i]._id)
                object.fcfa = price.price
                products.push(object)
            }
            let cartTotal = 0;
            for(let i = 0;i<products.length;i++){
                cartTotal += products[i].fcfa
            }
            const newCart = await new Cart({
                products:products,
                cartTotal:cartTotal,
            
                orderBy:req.user._id
            }).save()
            res.json(newCart) 
        }
        catch(error)
        {
            throw new Error(error)
        }
    }
)
const getUserCart = asyncHandler(
    async (req,res)=>{
        try{
            const cart = await Cart.findOne({orderBy:req.user._id}).populate("products.product","_id title price priceE")
            res.json(cart)
        }
        catch(error){
            throw new Error(error)
        }
    }
)
const emptyCart = asyncHandler(
    async (req,res) =>{
        try{
            const cart = await Cart.findOneAndRemove({orderBy:req.user._id})
            res.json(
                {
                    status:"success",
                    message:"cart removed",
                    cart
                }
            )
        }
        catch(error)
        {
            throw new Error(error)
        }
    }
)
const applyCoupon =  asyncHandler(
    async (req,res) =>{
        const {coupon} = req.body
        try{
            const c = await Coupon.findOne({name:coupon})
            if(c === null){
                throw new Error("invalid coupon")
            }
            const user = await User.findById(req.user._id)
            let {products,cartTotal,cartTotalEuro} = await Cart.findOne({
                orderBy:user._id
            }).populate("products.product")
          
            let FCFA = (
                cartTotal  - (cartTotal * c.discount)/100
            ).toFixed(2)
            while(FCFA%10 !== 0){
                FCFA++;
            }
            const cartAfterDiscount = await Cart.findOneAndUpdate(
                {orderBy:user._id},
                {
                 cartTotalDiscount:FCFA
                },{new:true}
            )
            res.json(cartAfterDiscount)
        

              

        }
        catch(error)
        {
            throw new Error(error)
        }
    }
)
const createOrder = asyncHandler(
    async (req,res) =>{
        try{
            const {CBD,couponApplied} = req.body;
            if(!CBD)
            {
                throw new Error("create cash order failed")
            }
            const user = await User.findById(req.user._id)
            const userCart = await Cart.findOne({orderBy:user._id})
            let finalAmount = 0;
        
            if(couponApplied && userCart.cartTotalDiscount > 0){
                finalAmount = userCart.cartTotalDiscount 
                

            }
            else{
                finalAmount = userCart.cartTotal 
            }

            let newOrder = await  new Order({
                products:userCart.products,
                paymentIntent:{
                    id:uniqid(),
                    method:req.body.method,
                    amount:finalAmount,
                   
                    created:Date.now(),
                    currency:"xaf"
                          
                },
                orderBy:user._id,
                orderStatus:"Cash Before Delivery"
            }).save()
            res.json(newOrder)
        }
        catch(error)
        {
            throw new Error(error)
        }
    }
)
const getOrders = asyncHandler(
    async (req,res) =>{
        try{
            const orders = await Order.find({orderBy:req.user._id}).populate("products.product").exec()
            res.json(orders)
        }
        catch(error)
        {
            throw new Error(error)
        }
    }
)
const updateOrder = asyncHandler(
    async (req,res) =>{
        try{
            const uo = await Order.findByIdAndUpdate(req.params.id,{
                orderStatus:req.body.status
            },{new:true})
            res.json(uo)
        }
        catch(error)
        {
            throw new Error(error)
        }
    }
)
const getUserDetails = asyncHandler(
    async(req,res,next) =>{
        const user = await User.findById(req.user.id)
        res.status(200).json({
            success:true,
            user
        })
    }
)
const uploadImageForProfile = asyncHandler(
    async (req,res)=>{
        const {id} = req.params
        try{
            const uploader = (path) => cloudinaryUploadImage(path,"images")
            const  urls = []
            const files = req.files
            console.log(files)
            for(const file of files){
                const {path} = file
                const newPath = await uploader(path)
                console.log(newPath)
                urls.push(newPath)
                fs.unlinkSync(path)
            }
            const USER = await Product.findByIdAndUpdate(id,{
                "images":urls[0]
            },{
                new:true
            }
            )

         res.json(USER)
        }
        catch(err){
            throw new Error(err)
        }
    }
)
module.exports = {getUserDetails, updateOrder, getOrders, createOrder, applyCoupon, emptyCart, getUserCart, createCart, saveAddress, getWishList, loginAdmin, addToWishList, resetPasswordToken, forgetPassword, updatePassword, logout, handleRefreshToken ,createUser,loginUserCtrl,getAllUsers,getOneUser,deleteUser,updateUser,blockUser,unBlockUser}
