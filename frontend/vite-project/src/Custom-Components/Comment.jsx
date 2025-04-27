import { Flex, HStack, VStack,Text, Separator} from '@chakra-ui/react'
import React, { useState } from 'react'
import { Avatar } from '../components/ui/avatar'
import { Ellipsis } from 'lucide-react'
import Actions from './Actions'
import { formatDistanceToNow } from 'date-fns'

const Comment = ({reply,lastreply}) => {

  return (
    <VStack gap={4} alignItems={"start"} w="full">
        <Flex justifyContent={"space-between"} w="full">
            <HStack>
                <Avatar name={reply.username}src={reply.profilePic}/>
                <Text>{reply.username}</Text>
            </HStack>

            
        </Flex>

        <Text>{reply.text}</Text>


        {!lastreply?<Separator/>:null}
    </VStack>
  )
}

export default Comment