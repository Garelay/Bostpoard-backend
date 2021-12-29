import mogoose from "mongoose";
const postSchema = new mogoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true    
    },
    password:{
        type: String,
        required: true
    },
    avatar:{
        type: String,
        default: "default"
    },
    refreshToken:{
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})
const postMessage = mogoose.model("user", postSchema)

export default postMessage