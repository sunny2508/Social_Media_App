import React, { useState } from 'react'
import { Flex,Box,Text, VStack, DialogHeader, DialogBody, Input, } from '@chakra-ui/react'
import {useRecoilState, useRecoilValue} from 'recoil'
import { userAtom } from '../atoms/useratom'
import { toaster,Toaster } from '../components/ui/toaster'
import axios from 'axios'
import {DialogCloseTrigger, DialogContent, DialogFooter, DialogRoot} from '../components/ui/dialog'
import { Button } from '../components/ui/button'
import { replySchema } from '../zod/postschema'
import { postAtom } from '../atoms/postatom'

const Actions = ({post}) => {

	
	const user = useRecoilValue(userAtom);
	const [liked,setLiked] = useState(post.likes.includes(user?._id));
	const [posts,setPosts] =  useRecoilState(postAtom);
	const [isLiking,setIsLiking] = useState(false);
	const [open,setOpen] = useState(false);
	const [reply,setReply] = useState("");
	const [errors,setErrors] = useState({});
	const [isReplying,setisReplying] = useState(false);

	const handleLikeandUnlike = async()=>{
		
		if(!user)
		{
			toaster.create({
				description:"Please login to like posts",
				type:"error",
				duration:3000
			})
			return;
		}
        
		setIsLiking(true);
		try{
			const response = await axios.post(`/posts/likeunlike/${post._id}`);
			
			if(response.status === 200)
			{
				
               console.log(response.data.message);
				if(!liked)
				{
					const updatedPosts = posts.map((p)=>{
						if(p._id === post._id)
						{
							return {...p,likes:[...p.likes,user._id]}
						}
						return p;
					});
					setPosts(updatedPosts);
				}
				else{
				    const updatedPosts = posts.map((p)=>{
						if(p._id === post._id)
						{
							return {...p,likes:p.likes.filter((id)=>id !== user._id)}
						}
						return p;
					})
					setPosts(updatedPosts);
				}
				setLiked((prev)=>!prev);
			}
		}
		catch(error)
		{
			toaster.create({
				description:error.response?error.response.data.message:"Error occured",
				type:"error",
				duration:3000
			})
		}
		finally{
			setIsLiking(false);
		}
	}

  const handleReply  = async(e)=>{
     e.stopPropagation();

	if(!user){
		toaster.create({
			description:"Please login to reply to posts",
			type:"error",
			duration:3000
		})
		return;
	}
	
	const result = replySchema.safeParse({text:reply});

	if(!result.success)
	{
		const fieldErrors = {};
		result.error.errors.forEach((err)=>{
			fieldErrors[err.path[0]] = err.message;
		})
		setErrors(fieldErrors);
		return;
	}
 
	setisReplying(true);
	try{
		const response = await axios.post(`/posts/reply/${post._id}`,result.data);

		if(response.status === 200)
		{
           console.log(response.data.data);

		   const updatedPosts = posts.map((p)=>{
			if(p._id === post._id)
			{
				return {...p,replies:[...p.replies,response.data.data]};
			}
			return p;
		   });
		   setPosts(updatedPosts);
		   toaster.create({
			description:response.data.message,
			type:"success",
			duration:3000
		   })
		   setReply("");
		   setOpen((prev)=>!prev);
		}
	}
	catch(error)
	{
      toaster.create({
		description:error.response?error.response.data.message:"Error occured",
		type:"error",
		duration:3000
	  })
	}
	finally{
		setisReplying(false);
	}
  }
	
  return (
	<VStack>
    <Flex gap={3} my={2} onClick={(e)=>e.preventDefault()}>
      <svg
					aria-label='Like'
					color={liked ? "rgb(237, 73, 86)" : ""}
					fill={liked ? "rgb(237, 73, 86)" : "transparent"}
					height='19'
					role='img'
					viewBox='0 0 24 22'
					width='20'
                    onClick={handleLikeandUnlike}
					
				>
					<path
						d='M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z'
						stroke='currentColor'
						strokeWidth='2'
					></path>
				</svg>

				<svg
					aria-label='Comment'
					color=''
					fill=''
					height='20'
					role='img'
					viewBox='0 0 24 24'
					width='20'
					onClick={()=>setOpen(!open)}
				>
					<title>Comment</title>
					<path
						d='M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z'
						fill='none'
						stroke='currentColor'
						strokeLinejoin='round'
						strokeWidth='2'
					></path>
				</svg>

				<RepostCard/>
				<ShareCard/>
                
		</Flex>

		<Flex alignItems={"center"} gap={2} my={2}>
                <Text fontSize={"sm"} color="gray.400">{post.replies.length} replies</Text>
                <Box h={1} w={1} bg="gray.400" rounded="full"></Box>
                <Text fontSize={"sm"} color="gray.400">{post.likes.length} likes</Text>
            </Flex>

			<DialogRoot open={open} onOpenChange={(e)=>setOpen(e.open)}
				onClick={(e)=>e.stopPropagation()}>
				<DialogContent onClick={(e)=>e.stopPropagation()}>
					<DialogHeader>Reply Box</DialogHeader>
					<DialogBody>
						<Input placeholder='Reply here...' value={reply}
						onChange={(e)=>setReply(e.target.value)} name="text"/>
						{errors.text && <Text>{errors.text}</Text>}
					</DialogBody>

					<DialogFooter>
						<Button bg={'red.400'} size={"sm"}
						onClick={handleReply} loading={isReplying}>Reply</Button>
					</DialogFooter>
					<DialogCloseTrigger/>
				</DialogContent>
			</DialogRoot>
			<Toaster/>
   </VStack>
  )
}

const RepostCard = ()=>{
	return(
		<svg
			aria-label='Repost'
			color='currentColor'
			fill='currentColor'
			height='20'
			role='img'
			viewBox='0 0 24 24'
			width='20'
		>
			<title>Repost</title>
			<path
				fill=''
				d='M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z'
			></path>
		</svg>
	)
}

const ShareCard = ()=>{
	return(
		<svg
			aria-label='Share'
			color=''
			fill='rgb(243, 245, 247)'
			height='20'
			role='img'
			viewBox='0 0 24 24'
			width='20'
		>
			<title>Share</title>
			<line
				fill='none'
				stroke='currentColor'
				strokeLinejoin='round'
				strokeWidth='2'
				x1='22'
				x2='9.218'
				y1='3'
				y2='10.083'
			></line>
			<polygon
				fill='none'
				points='11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334'
				stroke='currentColor'
				strokeLinejoin='round'
				strokeWidth='2'
			></polygon>
		</svg>
	)
}

export default Actions