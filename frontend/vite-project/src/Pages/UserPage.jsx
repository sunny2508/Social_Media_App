import React, { useEffect, useState } from 'react'
import UserHeader from '../Custom-Components/UserHeader'
import UserPost from '../Custom-Components/UserPost'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toaster } from '../components/ui/toaster';
import { Spinner,Flex,Text } from '@chakra-ui/react';
import Post from '../Custom-Components/Post';
import UsegetUserinfo from '../Hooks/UsegetUserinfo';
import { useRecoilState } from 'recoil';
import { postAtom } from '../atoms/postatom';


const UserPage = () => {

  const {getUser,user,loading} = UsegetUserinfo();
  const {username} = useParams();
  const [posts,setPosts] = useRecoilState(postAtom);
  const [isFetching,setisFetching] = useState(true);

  // const getUserProfile = async()=>{
  //   setLoading(true);
  //   try{
  //     const response = await axios.get(`/users/profile/${username}`);
  //     if(response.status === 200)
  //     {
  //       setUser(response.data.data);
  //     }
  //   }
  //   catch(error)
  //   {
  //     console.log(error.response?error.response.data.message:error);
  //     toaster.create({
  //       description:error.response?error.response.data.message:"Error occured",
  //       type:"error",
  //       duration:3000
  //     })
  //   }
  //   finally{
  //     setLoading(false);
  //   }
  // }

  const getUserPosts = async()=>{
    setisFetching(true);
    setPosts([]);
    try{
      const response = await axios.get(`/posts/user/${username}`);

      if(response.status === 200)
      {
        console.log(response.data.data);
        setPosts(response.data.data);
        
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
    finally{
      setisFetching(false);
    }
  }

  useEffect(()=>{
    getUser();
    getUserPosts();
  },[username])

  if(!user && loading)
  {
    return <Flex minH={"50vh"} justifyContent={"center"} align={"center"}>
      <Spinner size="xl"/>
    </Flex>
  }


  if(!user && !loading)
  {
    return <Flex height={"50vh"} justifyContent={"center"} align={"center"}>
      <Text as={'h1'} fontSize={"4xl"}>User not found</Text>
    </Flex>
  }

  return (
    <>
    <UserHeader user={user}/>

    {!isFetching && posts.length === 0 && <Text textAlign={"center"} my={10} fontSize={"md"}>
      User has not any posts
    </Text>}
    
    {isFetching && <Flex my={12}>
      <Spinner size="sm"/>
    </Flex>}

    { posts.map((post)=>(
      <Post key={post._id} post={post} postedBy={post.postedBy}/>
    ))}
    </>
  )
}

export default UserPage