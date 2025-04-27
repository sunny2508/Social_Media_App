import {
    Flex,
    Box,
    Input,
    Stack,
    Heading,
    Text,
    Field
} from '@chakra-ui/react'
//import { Field } from '../components/ui/field'
import {Button} from '../components/ui/button'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { authatom } from '../atoms/authatom'
import { useState } from 'react';
import { set } from 'zod';
import axios from 'axios';
import { Toaster, toaster } from '../components/ui/toaster';
import {Eye,EyeOff} from 'lucide-react'
import { Link } from 'react-router-dom';
import { loadingatom, userAtom } from '../atoms/useratom';


export default function LoginCard() {

    const [showPassword,setShowPassword] = useState(false);
    const setUser = useSetRecoilState(userAtom);
    const [loading,setLoading] = useState(false);
    
    const [inputs,setInputs] = useState({
        email:"",
        password:"",
    })

    const handleInputs = (e)=>{
        const {name,value} = e.target;

        setInputs({...inputs,[name]:value});
    }

    const handleLogin = async (e)=>{
        e.preventDefault();
        setLoading(true);
       try{
         const response = await axios.post('/users/login',inputs);
         if(response.status === 200)
         {
            toaster.create({
                description:"Login successfull",
                type:"success",
                duration:3000
            })
            setUser(response.data.data);
         }
       }
       catch(error)
       {
         console.log(error.response?error.response.data.message:error);
         toaster.create({
            description: error.response?error.response.data.message:error,
            type:"error",
            duration:3000
         })
       }
       finally{
        setLoading(false);
       }
    }
    return (
        <form onSubmit={handleLogin}>
        <Flex
            minH={'50vh'}
            align={'center'}
            justify={'center'}
        >
            <Stack gap={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={{base:"2xl",sm:"2xl",md:"3xl",lg:"4xl"}}>Sign in to your account</Heading>
                    <Text fontSize={{base:"sm",sm:"sm",md:"md",lg:"lg"}} color={'gray.600'}>
                        to enjoy all of our cool <Text as={"span"} color={'blue.400'}>features</Text> ✌️
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}

                    boxShadow={'lg'}
                    p={8}>
                    <Stack gap={4}>
                        <Field.Root>
                            <Field.Label htmlFor='email'>
                                Email
                            </Field.Label>
                            
                            <Input type="text" id="email" name="email" value={inputs.email}
                            onChange={handleInputs}/>
                            <Box position={"relative"} w='full'>
                                <Field.Label htmlFor='password'>
                                Password
                                </Field.Label>
                                <Input type={showPassword?"type":"password"} id="password"
                                 name="password" value={inputs.password}
                                 onChange={handleInputs}/>

                                 <Button position={'absolute'}
                                 onClick={()=>setShowPassword((prev)=>!prev)}
                                 right='0'
                                 variant={'plain'}>
                                 {showPassword?<Eye/>:<EyeOff/>}
                                 </Button>
                            </Box>
                        </Field.Root>
                        <Stack gap={10}>
                            <Button
                                bg={'red.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'red.500',
                                }}
                                type="submit"
                                loading={loading}>
                                Sign in
                            </Button>
                        </Stack>
                        <Text align={'center'}>
                            Not Registered? <Link  style={{color:'#6CB4EE'}}
                            to='/signup'>SignUp</Link>
                        </Text>
                    </Stack>
                </Box>
            </Stack>
            <Toaster/>
        </Flex>
        </form>
    )
}