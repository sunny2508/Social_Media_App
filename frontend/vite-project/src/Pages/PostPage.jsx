import { VStack,Flex,HStack,Image,Text,Box, Separator, Button, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Avatar } from '../components/ui/avatar'
import { Ellipsis } from 'lucide-react'
import Actions from '../Custom-Components/Actions'
import Comment from '../Custom-Components/Comment'
import UsegetUserinfo from '../Hooks/UsegetUserinfo'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Toaster, toaster } from '../components/ui/toaster'
import { formatDistanceToNow } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { userAtom } from '../atoms/useratom'
import { postAtom } from '../atoms/postatom'

const PostPage = () => {

  const {getUser,user,loading} = UsegetUserinfo();
  const [posts,setPosts] =  useRecoilState(postAtom);
  const {pid} = useParams();
  const currentUser =  useRecoilValue(userAtom);

  const currentPost = posts[0];

  const getPost = async()=>{
    setPosts([])
    try{
      const response = await axios.get(`/posts/${pid}`);
      
      if(response.status === 200)
      {
        console.log(response.data.data);
        setPosts([response.data.data]);
      }
    }
    catch(error)
    {
      toaster.create({
        description:error.response?error.response.data.message:"Error occured",
        type:"error",
        duration:3000
      })
      setPosts([]);
    }
  }

  const handleDelete = async()=>{

    if(!window.confirm("Are you sure you want to delete this post")) return;
    try{
      const response = await axios.delete(`/posts/${pid}`);
      if(response.status === 200)
      {
        toaster.create({
          description:response.data.message,
          type:"success",
          duration:3000
        })
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
  }

 useEffect(()=>{
  getUser();
  getPost();
 },[pid])

 if(!user && loading)
 {
  return <Flex height={"50vh"} justifyContent={"center"} align={"center"}>
    <Spinner size="xl"/>
  </Flex>
 }

 if(!currentPost)
 {
  return null;
 }

  return (
    <VStack alignItems={"start"} gap={4}>
      <Flex justifyContent={"space-between"} w="full">
        <HStack>
        <Avatar name={user.name} src={user.profilePic}/>
          <Text>{user.username}</Text>
          <Image src="/verified.png" h={4} w={4}/>
        </HStack>

        <HStack>
          <Text>{formatDistanceToNow(new Date(currentPost.createdAt))}</Text>
          {currentUser?._id === user._id?<Trash2 size={15} cursor={"pointer"}
          onClick={handleDelete}/>:null}
        </HStack>
      </Flex>

      <Text>{currentPost.postTitle}</Text>

      <Box overflow={"hidden"} border={"1.5px solid"} borderColor={"gray.400"}
      rounded="md">
        <Image src={currentPost.postImg}/>
      </Box>

       <Actions post={currentPost}/>

      

      <Separator/>

      <Flex justifyContent={"space-between"} w="full">
        <HStack>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.400"}>Get the app to like,post and reply</Text>
        </HStack>
        <Button bg="gray.700" p={4} color="white">Get</Button>
      </Flex>
      <Separator/>
    
    {currentPost.replies && currentPost.replies.map((reply)=>(
      <Comment key={reply._id} reply={reply}
      lastreply={reply._id === currentPost.replies[currentPost.replies.length-1]._id}/>
    ))}
  
    <Toaster/>
    </VStack>
  )
}

export default PostPage