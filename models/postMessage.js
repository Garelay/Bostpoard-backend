import mogoose from "mongoose";
const postSchema = new mogoose.Schema({
    title: String,
    message: {
        type: String,
        required: true,    
    },
    creator: String,
    tags: [String],
    selectedFile: String,
    likeCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})
const postMessage = mogoose.model("postMessage", postSchema)

export default postMessage