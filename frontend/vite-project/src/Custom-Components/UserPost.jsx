import { Flex, VStack,Box,HStack,Image,Text, Separator } from '@chakra-ui/react'
import React ,{useState}from 'react'
import { Avatar } from '../components/ui/avatar'
import { Link } from 'react-router-dom'
import { Ellipsis } from 'lucide-react';
import Actions from './Actions';

const UserPost = ({postimg,postTitle,like,replies}) => {

    const [liked,setLiked] = useState(false);
  return (
    <>
    <Link to="/:username/post/:pid">
    <Flex gap={3} my="4" py={5} >
        <VStack mx="4">
            <Avatar name="Markzuckerberg" src="/mark-zuckerberg.jpg"/>
            <Box w="1px" h="full" bg="gray.700"></Box>
            <Box position={"relative"} w="full">
                <Avatar
                name="Dan Abramov"
                src="https://bit.ly/dan-abramov"
                position={"absolute"}
                top={"0px"}
                left={"5px"}
                size="xs"
                />

                <Avatar
                name="Sage Adebayo"
                src="https://bit.ly/sage-adebayo"
                position={"absolute"}
                bottom={"0px"}
                right="15px"
                size="xs"
                />

                <Avatar
                name="Random User"
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04"
                position={"absolute"}
                bottom="0px"
                left="20px"
                size="xs"/>
            </Box>
        </VStack>

        <VStack gap={2} w="full" alignItems={"start"}>
            <Flex justifyContent={"space-between"} w="full">
                <HStack>
                 <Text>markzuckerberg</Text>
                 <Image src="/verified.png" h={4} w={4}/>
                </HStack>

                <HStack>
                    <Text color="gray.400" fontSize={"sm"}>1d</Text>
                    <Ellipsis size={20} />
                </HStack>
            </Flex>

            <Text>{postTitle}</Text>

            {postimg && <Box overflow={"hidden"} border={"1px solid"} borderColor={"gray.700"}
            rounded={"md"} >
                <Image src={postimg}/>
            </Box>}

            <Actions liked={liked} setLiked={setLiked}/>

            <Flex alignItems={"center"} gap={2} my={2}>
                <Text fontSize={"sm"} color="gray.400">{replies} replies</Text>
                <Box h={1} w={1} bg="gray.400" rounded="full"></Box>
                <Text fontSize={"sm"} color="gray.400">{like} likes</Text>
            </Flex>
        </VStack>
    </Flex>
    </Link>
    <Separator mt={"4px"}/>
    </>
  )
}

export default UserPost