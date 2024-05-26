import mongoose from "mongoose";
const commentSchema=new mongoose .Schema(
    {
        userId:{
            type:String,
            required:true
        },
        postId:{
            type:String,
            required:true 
        },
        comment:{
            type:String,
            required:true
        },
        likes:{
            type:Array,
            default:[]
        },
        numberofLikes:{
            type:Number,
            default:0
        }
    },{timestamps:true}
)
const Comment = mongoose.model('Comment', commentSchema);

export default Comment;