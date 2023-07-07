const { createProduct,getAllProductsAdmin, getOneProduct, getAllProducts, updateProduct, deleteProduct, rating, uploadImage } = require("../controller/productCtrl")
const {isAdmin,authMiddleWare}  = require("../middlewares/authMiddleware")
const { uploadPhoto, productsImagesResize } = require("../middlewares/uploadImage")
const router = require("express").Router()

router.post("/", createProduct)
router.put("/rating",authMiddleWare,rating)
router.get("/admin",authMiddleWare,isAdmin,getAllProductsAdmin)
router.put("/upload/:id",uploadPhoto.array("images",10),productsImagesResize,uploadImage)
router.get("/:id",getOneProduct)
router.get("/",getAllProducts)
router.put("/:id",authMiddleWare,isAdmin,updateProduct)
router.delete("/:id",authMiddleWare,isAdmin, deleteProduct)



module.exports = router