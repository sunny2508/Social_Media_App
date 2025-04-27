import {z} from 'zod'

const postSchema = z.object({
    postTitle:z.string().min(1,{message:"Text should be atleast 1 character long"})
    .max(500,{message:"Text should not exceed more than 2000 characters"}),
    postImg:z.string().optional()
})

const replySchema = z.object({
    text:z.string().min(1,{message:"Text is required"})
    .max(500,{message:"Reply cannot exceed more than 2000 characters"})
})

export {postSchema,replySchema}