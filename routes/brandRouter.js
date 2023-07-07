const router = require('express').Router()
const { createBrand, updateBrand, deleteBrand, getOneBrand, getAllBrands } = require('../controller/brandCtrl')
const {isAdmin,authMiddleWare} = require("../middlewares/authMiddleware")

router.post("/",authMiddleWare,isAdmin, createBrand)
router.get("/",getAllBrands)
router.put("/:id",authMiddleWare,isAdmin, updateBrand)
router.get("/:id",getOneBrand)
router.delete("/:id",deleteBrand)

module.exports = router