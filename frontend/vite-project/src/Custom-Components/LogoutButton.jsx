import React from 'react'
import { useSetRecoilState } from 'recoil'
import { userAtom } from '../atoms/useratom'
import { toaster } from '../components/ui/toaster';
import { Button } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export const LogoutButton = () => {
    const setUser = useSetRecoilState(userAtom);
    const navigate = useNavigate();

    const handleLogout = async()=>{
        try{
            const response = await axios.post('/users/logout');
            if(response.status === 200)
            {
                setUser(null);
                navigate('/login')
            }
        }
        catch(error)
        {
          console.log(error.response?error.response.data.message:error);
          toaster.create({
            description:error.response?error.response.data.message:error,
            type:"error",
            duration:3000
          })
        }
    }
  return (
    <Button onClick={handleLogout}
    size="xs" variant={"subtle"}>
    <LogOut/>
    </Button>
  )
}
