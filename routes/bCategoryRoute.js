const router = require('express').Router()
const { createCategory, updateCategory, deleteCategory, getOneCategory, getAllCategory } = require('../controller/bCategoryCtrl')
const {isAdmin,authMiddleWare} = require("../middlewares/authMiddleware")

router.post("/",authMiddleWare,isAdmin, createCategory)
router.get("/",getAllCategory)
router.put("/:id",authMiddleWare,isAdmin, updateCategory)
router.get("/:id",getOneCategory)
router.delete("/:id",authMiddleWare,isAdmin,deleteCategory)

module.exports = router