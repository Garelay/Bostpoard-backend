import mongoose from "mongoose"
import postMessage from "../models/postMessage.js"
import user from "../models/user.js"

export const getPosts = async (req,res)=>{
    try {
        const postMessages = await postMessage.find()
        res.status(200).json(postMessages)
    } catch (error) {
        res.status(404).json({message: error.message})
    }   
};

export const createPost = async (req,res) =>{
    const post = req.body;
    const newPost = new postMessage(post);
    try {
        await newPost.save()
        res.status(201).json(newPost)
        
    } catch (error) {
        res.status(409).json({message: error.message})
    }
}

export const likePost = async(req,res) =>{
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`)
    try {
        const currentUser = await user.findById(req.user.id)
        const post = await postMessage.findById(id)
        const index = currentUser.likedPosts.indexOf(id)
        if (index >= 0) {
            currentUser.likedPosts.splice(index,1)
            post.likeCount--
        } else {
            currentUser.likedPosts.push(post._id)
            post.likeCount++
        }
        await user.findByIdAndUpdate(currentUser.id, {likedPosts: currentUser.likedPosts})
        const updatedPost = await postMessage.findByIdAndUpdate(id, {likeCount: post.likeCount}, {new:true})
        res.status(200).json(updatedPost)
    } catch (error) {
        res.status(400).json({message:error.message})
    }   
}

export const deletePost = async(req,res) =>{
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`)
    const oldPost = await postMessage.findById(id)
    if (oldPost.creator !== req.user.name) return res.status(409).send('Unathorized')
    const post = await postMessage.findByIdAndRemove(id)
    res.json({message: "Post deleted succesfully."})
}

export const updatePost = async(req,res) =>{
    const {id} = req.params
    const { title, message, creator, selectedFile, tags } = req.body
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`)
    const oldPost = await postMessage.findById(id)
    if (oldPost.creator !== req.user.name) return res.status(409).send('Unathorized')
    const updatedPost = { creator, title, message, tags, selectedFile, _id: id }
    await postMessage.findByIdAndUpdate(id, updatePost)
    res.json(updatedPost)
}
