import { Flex, VStack,Box,HStack,Image,Text, Separator, useRecipe } from '@chakra-ui/react'
import React ,{useEffect, useState}from 'react'
import { Avatar } from '../components/ui/avatar'
import { Link } from 'react-router-dom'
import { Ellipsis } from 'lucide-react';
import Actions from './Actions';
import axios from 'axios';
import {toaster,Toaster} from '../components/ui/toaster'
import { useNavigate } from 'react-router-dom';
import { compareAsc, formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from 'recoil';
import { userAtom } from '../atoms/useratom';
import { Trash2 } from 'lucide-react';
import { postAtom } from '../atoms/postatom';

const Post = ({post,postedBy}) => {

    const [user,setUser] = useState(null);
    const navigate = useNavigate();
    const currentUser = useRecoilValue(userAtom);
    const [isDeleting,setIsDeleting] = useState(false);
    const [posts,setPosts] = useRecoilState(postAtom);

    const getUser = async()=>{
        try{
            const response = (await axios.get(`/users/profile/${postedBy}`));

            if(response.status === 200)
            {
                
                setUser(response.data.data);
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
    }

    const handleDelete = async(e)=>{
        e.preventDefault();

        if(!window.confirm("Are you sure you want to delete this post"))return;
        setIsDeleting(true);
        try{
            const response = await axios.delete(`/posts/${post._id}`);
            if(response.status === 200)
            {
                toaster.create({
                    description:response.data.message,
                    type:"success",
                    duration:3000
                })
                setPosts(posts.filter((p)=>p._id !== post._id));
            }
        }
        catch(error)
        {
            toaster.create({
                description:error.response?error.response.data.message:"error occured",
                type:"error",
                duration:3000
            })
        }
        finally{
            setIsDeleting(false);
        }
    }

    useEffect(()=>{
        getUser();
    },[]);

    if(!user)
    {
        return null;
    }
  return (
    <>
    <Link to={`/${user.username}/post/${post._id}`}>
    <Flex gap={3} my="4" py={5} >
        <VStack mx="4">
            <Avatar name={user.name} src={user.profilePic}
            onClick={(e)=>{
                e.preventDefault();
                navigate(`/${user.username}`)
            }}/>
            <Box w="1px" h="full" bg="gray.700"></Box>
            <Box position={"relative"} w="full">
                {post.replies.length === 0 && <Text fontSize={"2xl"}>🥱</Text>}
                {post.replies[0] && (
                    <Avatar
                    name={post.replies[0].username}
                    src={post.replies[0].profilePic}
                    position={"absolute"}
                    top={"0px"}
                    left={"5px"}
                    size="xs"/>
                )}

                {post.replies[1] && (
                    <Avatar
                    name={post.replies[1].username}
                    src={post.replies[1].profilePic}
                    position={"absolute"}
                    bottom={"0px"}
                    right="15px"
                    size="xs"
                    />
                )}

                {post.replies[2] &&( 
                <Avatar
                name={post.replies[2].username}
                src={post.replies[2].profilePic}
                position={"absolute"}
                bottom="0px"
                left="20px"
                size="xs"/>)}
            </Box>
        </VStack>

        <VStack gap={2} w="full" alignItems={"start"}>
            <Flex justifyContent={"space-between"} w="full">
                <HStack>
                 <Text onClick={(e)=>{
                    e.preventDefault();
                    navigate(`/${user.username}`)
                 }}>{user.username}</Text>
                 <Image src="/verified.png" h={4} w={4}/>
                </HStack>

                <HStack>
                    <Text color="gray.400" fontSize={"sm"}>
                    {formatDistanceToNow(new Date(post.createdAt))}
                    </Text>
                    {currentUser?._id === user._id?<Trash2 size={15}
                    onClick={handleDelete} cursor={"pointer"}/>:null}
                </HStack>
            </Flex>

            <Text>{post.postTitle}</Text>

            {post.postImg && <Box overflow={"hidden"} border={"1px solid"} borderColor={"gray.700"}
            rounded={"md"} >
                <Image src={post.postImg}/>
            </Box>}

            <Actions post={post}/>

            
        </VStack>
    </Flex>
    </Link>
    <Separator mt={"4px"}/>
    <Toaster/>
    </>
  )
}

export default Post