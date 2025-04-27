import mongoose,{Schema} from 'mongoose'

const postSchema = new Schema({
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    postTitle:{
        type:String,
        maxLength:500,
        required:true
    },
    postImg:{
        type:String
    },
    likes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"User",
        default:[]
    },
    replies:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            profilePic:{
                type:String,
                default:""
            },
            text:{
                type:String,
                required:true,
            },
            username:{
                type:String
            }
        }
    ]
},{timestamps:true});

const Post = mongoose.model("Post",postSchema);

export default Post