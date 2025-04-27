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

export default signUpSchema;

const obj = {
    name:1234,
    username:'sunnny',
    email:'hellowsingh',
    password:"bdiginj"
}

const result = signUpSchema.safeParse(obj);

if(result.success)
{
    console.log(result.data)
}
else{
    const errorMessages = {}
    result.error.errors.forEach((err)=>{
        errorMessages[err.path[0]] = err.message;
    })
    console.log(errorMessages);
    console.log(result.error.errors.map((error)=>error.message))
}