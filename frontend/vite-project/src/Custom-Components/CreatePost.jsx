import React,{useRef,useState} from 'react'
import {
    DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
  } from "../components/ui/dialog"
import { Field,Input,Text, Textarea,Image,Box,
Flex,
} from '@chakra-ui/react'
import {Button} from '../components/ui/button'
import { CloseButton } from '../components/ui/close-button';
import { ImagePlus } from 'lucide-react';
import Usepreviewimg from '../Hooks/Usepreviewimg';
import axios from 'axios'
import { postSchema } from '../zod/postschema';
import {useRecoilState, useRecoilValue} from 'recoil'
import { userAtom } from '../atoms/useratom';
import {toaster,Toaster} from '../components/ui/toaster'
import { postAtom } from '../atoms/postatom';
import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';

const MAX_CHAR = 500;
const CreatePost = () => {

    const inputRef = useRef();
    const {handleImageChange,imgurl,setImgurl,clearImage} = Usepreviewimg();
    const [postText,setPostText] = useState("");
    const [remainingchar,setremainingchar] = useState(MAX_CHAR);
    const user = useRecoilValue(userAtom);
    const [errors,setErrors] = useState({});
    const [loading,setLoading] = useState(false);
    const [open,setOpen] = useState(false);
    const [posts,setPosts] = useRecoilState(postAtom);
    const {username} = useParams();
    

    const handleInput = (e)=>{
       
        const inputText = e.target.value;
        
        if(inputText.length > MAX_CHAR)
        {
            const truncatedText = inputText.slice(0,MAX_CHAR);
            setPostText(truncatedText);
            setremainingchar(0);
        }
        else{
            setPostText(inputText);
            setremainingchar(MAX_CHAR-inputText.length);
        }
    }
     
    const handlePost = async()=>{
        
        
        const result = postSchema.safeParse({postTitle:postText,postImg:imgurl || ""});

        if(!result.success)
        {
            const fieldErrors = {};
            result.error.errors.forEach((err)=>{
                fieldErrors[err.path[0]] = err.message;
            })
            
            setErrors(fieldErrors);
            return;
        }

        setLoading(true);
        try{
            const response = await axios.post('/posts/create',{...result.data,postedBy:user});
            if(response.status === 201)
            {
                toaster.create({
                    description:response.data.message,
                    type:"success",
                    duration:3000
                })
                if(username === user.username)
                {
                    setPosts([response.data.data,...posts]);
                }
                
                setPostText("");
                setremainingchar(MAX_CHAR);
                setImgurl("");
                setOpen(false);
                
            }
        }
        catch(error)
        {
           toaster.create({
            description:error.response?error.response.data.message:error,
            type:"error",
            duration:3000
           })
        } 
        finally{
            setLoading(false);
        }
    }

    

  return (
    <>
    <DialogRoot open={open} onOpenChange={(e)=>setOpen(e.open)}>
        <DialogTrigger asChild>
            <Button position={"fixed"} right={5} bottom={10}
            size={{base:"sm", md:"md" ,lg:"lg"}} variant={"subtle"} bg="gray.500"><Plus color='black'/></Button>
        </DialogTrigger>

        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create Post</DialogTitle>
            </DialogHeader>

            <DialogBody>
                <Field.Root>
                    <Textarea placeholder='Post content goes here'
                    value={postText} onChange={handleInput}></Textarea>
                    { errors.postTitle && <Text color={"red.500"}>{errors.postTitle}</Text>}
                </Field.Root>
                <Text textAlign={"right"} m={1} color={"gray.400"}>{remainingchar}/{MAX_CHAR}</Text>

                <Input type="file" ref={inputRef} hidden onChange={handleImageChange}/>

                <Button variant={"plain"} onClick={()=>inputRef.current.click()}>
                    <ImagePlus/>
                </Button>

              {imgurl && <Flex mt={2} position={"relative"} w={"full"}>
                <Image src={imgurl} alt="my-image"/>
                <CloseButton onClick={()=>{clearImage(inputRef)}}
                position={"absolute"}
                top={2}
                right={2}
                color={"gray.400"}/>
                </Flex>}

            </DialogBody>

            <DialogFooter>
                <Button bg={"blue.600"} onClick={handlePost}
                loading={loading}>Post</Button>
            </DialogFooter>
            <DialogCloseTrigger/>
        </DialogContent>
    </DialogRoot>
    <Toaster/>
    </>
  )
}

export default CreatePost