const { createBlog, updateBlog, getOneBlog, getAllBlogs, deleteBlog, likeBlog, dislikeBlog, uploadImageBlog } = require("../controller/blogCtrl")
const { authMiddleWare, isAdmin } = require("../middlewares/authMiddleware")
const { uploadPhoto, blogImagesResize } = require("../middlewares/uploadImage")
const router = require("express").Router()


router.put("/like",authMiddleWare,likeBlog)
router.put("/dislike",authMiddleWare,dislikeBlog)
router.get("/admin",authMiddleWare,isAdmin,getAllBlogs)
router.post("/",authMiddleWare,isAdmin, createBlog)
router.put("/:id",authMiddleWare,isAdmin, updateBlog)
router.delete("/:id",authMiddleWare,isAdmin, deleteBlog)
router.get("/:id",getOneBlog)
router.put("/upload/:id",uploadPhoto.array("images",2),blogImagesResize,uploadImageBlog)



module.exports = router