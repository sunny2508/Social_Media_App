import { Flex,HStack,Image,Button } from '@chakra-ui/react'
import React from 'react'
import {useColorMode} from '../components/ui/color-mode'
import { useRecoilValue } from 'recoil';
import { userAtom } from '../atoms/useratom';
import { House } from 'lucide-react';
import {Link} from 'react-router-dom'
import { User } from 'lucide-react';
import { LogoutButton } from './LogoutButton';
import { LogOut } from 'lucide-react';


const Header = () => {
    const {colorMode,toggleColorMode} = useColorMode();
    const user = useRecoilValue(userAtom);
  return (
    <Flex justifyContent={user?"space-between":"center"} my={8}
  alignItems={"center"}>

     {user && <Link to="/">
     <House size={24}/>
     </Link>}
      
        <Image
        cursor={"pointer"}
        h={"10"}
        src={colorMode === "light" ? '/dark-logo.svg' : '/light-logo.svg'}
        onClick={toggleColorMode}
        size={24}/>

        {user && <Flex alignItems={"center"} gap={12}>
         <Link to={`${user.username}`}>
        <User size={24}/>
        </Link>
        <LogoutButton/>
        </Flex>}
    </Flex>
  )
}

export default Header