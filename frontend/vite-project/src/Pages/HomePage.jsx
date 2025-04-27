import { Button, Spinner,Flex, Text } from '@chakra-ui/react'
import React,{useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {toaster,Toaster} from '../components/ui/toaster'
import Post from '../Custom-Components/Post'
import { useRecoilState } from 'recoil'
import { postAtom } from '../atoms/postatom'

const HomePage = () => {

  const [posts,setPosts] = useRecoilState(postAtom);
  const [loading,setLoading] = useState(true);

  const getFeedPosts = async()=>{
    setLoading(true);
    setPosts([]);
    try{
      const response = await axios.get('/posts/feed');
      if(response.status === 200)
      {
        setPosts(response.data.data);
        console.log(response.data.data)
      }
    }
    catch(error)
    {
      toaster.create({
        description:response.error?response.error.data.message:error,
        type:"error",
        duration:3000
      })
      setPosts([]);
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    getFeedPosts();
  },[])

  return(
    <>

{!loading && posts.length === 0 && <Flex height={"50vh"} justifyContent={"center"}
    align={"center"}>
      <Text as="h1" fontSize={"2xl"}>Follow some users to see posts</Text>
      </Flex>}

    {loading && (<Flex  justifyContent={"center"} align={"center"}>
      <Spinner size="5xl"/>
      </Flex>)}

      {posts && posts.map((post)=>(
        <Post key={post._id} post={post} postedBy={post.postedBy}
        />
      ))}

    </>
  )
}

export default HomePage