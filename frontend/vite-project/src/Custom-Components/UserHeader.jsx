import { VStack,Flex,Text,Box, HStack,MenuRoot,MenuContent,MenuItem,MenuTrigger,Button }
 from '@chakra-ui/react'
import {Avatar} from '../components/ui/avatar'
import React, { useState } from 'react'
import { LuInstagram } from 'react-icons/lu'
import { CgMoreO } from "react-icons/cg"
import '../style.css'
import {toaster,Toaster} from '../components/ui/toaster'
import { useRecoilValue } from 'recoil'
import { userAtom } from '../atoms/useratom'
import { Link } from 'react-router-dom'
import axios from 'axios'


const UserHeader = ({user}) => {

    const currentUser = useRecoilValue(userAtom);
    const [following,setFollowing] = useState(user?.followers.includes(currentUser._id));
    const [followers,setFollowers] = useState(user?.followers || [])


    const copyURL = ()=>{
        const currentURL = window.location.href;

        navigator.clipboard.writeText(currentURL).then(toaster.create({
            description:"URL copied successfully",
            type:"info",
            duration:3000
        }))
    }

    const handleFollow = async()=>{
        if(!currentUser)
        {
            toaster.create({
                description:"Please login to follow",
                type:"info",
                duration:3000
            })
            return;
        }
        try{
            const response = await axios.post(`/users/followunfollow/${user._id}`);
            if(response.status === 200)
            {
                toaster.create({
                    description:response.data.message,
                    type:"success"
                })
                setFollowers((prevfollowers)=>
                    following?prevfollowers.filter((id)=>id !== currentUser._id)://removing follower
                    [...prevfollowers,currentUser._id]//adding follower
                )
                setFollowing((prev)=>!prev)
            }
        }
        catch(error)
        {
            console.log(error.response?error.response.data.message:error);
            toaster.create({
                description:error.response.data.message,
                type:"error",
                duration:3000
            })
        }
    }

  return (
    <VStack gap={"8"} alignItems={"start"}>
        <Flex justifyContent={"space-between"} w="full">
            <Box>
                <Text fontSize={"xl"} fontWeight={"bold"}>{user?.name}</Text>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={'xs'}>{user?.username}</Text>
                    <Text bg={"gray.700"} rounded="full"
                    p={1} fontSize={'xs'} color={"gray.400"}>threads.net</Text>
                </Flex>
            </Box>

            <Box>
                {user?.profilePic && <Avatar name={user?.name} src={user?.profilePic}
                size="2xl"/>}

                {!user?.profilePic && <Avatar name={user?.name} src={"https://bit.ly/broken-link"}
                size="2xl"/>}
            </Box>
        </Flex>

        <Text>{user?.bio}
        </Text>

        {currentUser._id === user?._id && <Link to='/updateprofile'>
        <Button size={{base:"sm" ,md:"md",lg:"lg"}}>Update Profile</Button>
        </Link>}

        {currentUser._id !==user?._id && <Button bg={following?"red.400":"blue.400"} onClick={handleFollow}>
            {following?"Unfollow":"Follow"}
        </Button>}

        <Flex justifyContent={"space-between"} w="full">
            <HStack>
                <Text fontSize={"sm"} color="gray.400">{followers.length} Followers</Text>
                <Box h={1} w={1} rounded={"full"} bg="gray.400"></Box>
                <Text fontSize={"sm"} color="gray.400">instagram.com</Text>
            </HStack>

            <HStack>
                <LuInstagram size={24} cursor={"pointer"}
                className='iconClasses'/>
                <MenuRoot>
                    <MenuTrigger asChild>
                    <CgMoreO size={24} cursor={"pointer"}
                className='iconClasses' />
                    </MenuTrigger>
                    <MenuContent>
                        <MenuItem value="copy-link" onClick={copyURL} >Copy-URL</MenuItem>
                    </MenuContent>
                </MenuRoot>
            </HStack>
        </Flex>

        <Flex w="full">
            <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"}
            p={3} cursor={"pointer"}>
                <Text>Threads</Text>
            </Flex>

            <Flex flex={1} borderBottom={"1.5px solid"} borderColor={"gray.400"} justifyContent={"center"}
            p={3} cursor={"pointer"}>
                <Text>Replies</Text>
            </Flex>
        </Flex>
        <Toaster/>
    </VStack>
  )
}

export default UserHeader