import { z } from "zod"

const signUpSchema = z.object({

    name: z.string({ message: "Name should be string format" })
        .min(1, { message: "Name should be atleast 1 character long" }).
        max(100, { message: "Name cannot be more than 100 characters" }),

    email: z.string().email({ message: "Email is not in correct format" }),

    username: z.string({ message: "username should be string format" })
        .min(1, { message: "Name should be atleast one character long" })
        .max(100, { message: "Username cannot be more than 100 characters" }),

    password: z.string().min(8, { message: "Password should be atleast 8 characters long" })
        .regex(/[A-Z]/, { message: "Password should contain atleast one uppercase character" })
        .regex(/[a-z]/, { message: "Password should contain atleast one lowercase character" })
        .regex(/[\W_]/, { message: "Password should contain atleast one special character" })
})

const updateProfileSchema = z.object({
    name: z.string({ message: "Name should be string" }).min(1, { message: "Name should be atleast 1 character long" })
        .max(100, { message: "Name cannot be more than 100 characters" }).optional(),

    email: z.string().email({ message: "Email is not in correct format" }).optional(),

    username: z.string({ message: "Username should be string" })
        .min(1, { message: "Name should be atleast one character long" })
        .max(100, { message: "Username cannot be more than 100 characters" }).optional(),

    password: z.string().min(8, { message: "Password should be atleast 8 characters long" })
        .regex(/[A-Z]/, { message: "one uppercase required" })
        .regex(/[a-z]/, { message: "one lowercase required" })
        .regex(/[\W_]/, { message: "one special character" })
        .optional(),

    profilePic: z.string().default(""),

    bio: z.string().max(500, { message: "Bio cannot be more than 500 characters" })
        .optional()
})



export  {signUpSchema,updateProfileSchema}