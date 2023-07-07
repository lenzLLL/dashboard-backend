const { createCoupon, getAllCoupons, updateCoupon, getOneCoupon } = require("../controller/couponCtrl")
const { authMiddleWare, isAdmin } = require("../middlewares/authMiddleware")

const router = require("express").Router()

router.post("/",authMiddleWare,isAdmin, createCoupon)
router.get("/",authMiddleWare,isAdmin, getAllCoupons)
router.get("/:id",authMiddleWare,isAdmin, getOneCoupon)
router.put("/:id",authMiddleWare,isAdmin, updateCoupon)

module.exports = router