import express from "express"
import {signUp, logIn, changeAvatar, getUserAvatar, refresh} from "../controllers/users.js"
import authMiddleware from "../middleware/auth-middleware.js"

const router = express.Router()

router.post("/signup", signUp)
router.post("/login", logIn)
router.patch("/:id", authMiddleware, changeAvatar)
router.get("/:id", authMiddleware, getUserAvatar)
router.post("/refresh/:id", refresh)

export default router