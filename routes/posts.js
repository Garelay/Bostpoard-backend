import express from "express";
import { getPosts, createPost, likePost, deletePost, updatePost } from "../controllers/posts.js";
import authMiddleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.get("/", getPosts)
router.post("/", authMiddleware, createPost)
router.patch("/:id/likePost", authMiddleware, likePost)
router.delete("/:id", authMiddleware, deletePost)
router.patch('/:id', authMiddleware, updatePost)

export default router;