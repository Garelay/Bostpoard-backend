import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import user from "../models/user.js"
export const signUp = async (req,res) =>{
    const oldUserName = await user.findOne({name: req.body.name})
    const oldUserMail = await user.findOne({email: req.body.email})
    if (oldUserName) {return res.status(400).json({message: "User with this name already exists"})}
    if (oldUserMail) {return res.status(400).json({message: "User with this email already exists"})}
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    try {
        const newUser = new user({name: req.body.name, email:req.body.email ,password: hashedPassword})
        const accessToken = jwt.sign({id: newUser._id, name: newUser.name}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "30m"})
        const refreshToken = jwt.sign({id: newUser._id, name: newUser.name}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "4w"})
        newUser.refreshToken = refreshToken
        await newUser.save()
        res.status(200).json({avatar: newUser.avatar, accessToken, refreshToken})
    } catch (error) {
        res.status(409).json({message: error.message})
    }
}
export const logIn = async (req,res) =>{
    const { email, password } = req.body
    try {
        const currentUser = await user.findOne({email})
        let match = await bcrypt.compare(password, currentUser.password)
        if (!match) return res.status(403).json({message: "Wrong auth data"})
        const accessToken = jwt.sign({id: currentUser._id, name: currentUser.name}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "5m"})
        const refreshToken = jwt.sign({id: currentUser._id, name: currentUser.name}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "4w"})
        currentUser.refreshToken = refreshToken
        await currentUser.save()
        res.status(200).json({avatar: currentUser.avatar, accessToken, refreshToken})
    } catch (error) {
        res.status(409).json({message: error.message})
    }
}

export const changeAvatar = async (req,res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id: ${id}`)
    try {
        const img = req.body.avatar
        const newUser = await user.findByIdAndUpdate(id, {avatar: img}, {new: true}); 
        return res.json(newUser.avatar)
    } catch (error) {
        res.status(400).json({message: error.message})
    }}

export const getUserAvatar = async (req,res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id: ${id}`)
    try {
        const currentUser = await user.findById(id)
        return res.json(currentUser.avatar)
    } catch (error) {
        res.status(400).json({message: error.message})
    }}

export const refresh = async (req,res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id: ${id}`)
    const token = req.body.token
    if (!token) return res.status(401).send(`Unauthorized`)
    try {
        const currentUser = await user.findById(id)
        const isVerified = jwt.verify(currentUser.refreshToken,process.env.REFRESH_TOKEN_SECRET)      
        if (isVerified && (currentUser.refreshToken = token)) {
            const accessToken = jwt.sign({id: currentUser._id, name: currentUser.name}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "5m"})
            return res.json(accessToken)
        }       
    }catch (error) {
        res.status(400).json({message: error.message})}
    }
