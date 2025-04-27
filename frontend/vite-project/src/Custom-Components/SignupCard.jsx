import {
    Flex,
    Box,
    Input,
    Stack,
    Button,
    Heading,
    Text,
    Field
} from '@chakra-ui/react'
//import { Field } from '../components/ui/field'
import { useSetRecoilState } from 'recoil'
import { authatom } from '../atoms/authatom'
import {Eye,EyeOff} from 'lucide-react'
import { useState } from 'react'
import axios from 'axios'
import {signUpSchema} from '../zod/userschema'
import {toaster,Toaster} from '../components/ui/toaster'
import { Link,useNavigate } from 'react-router-dom'


export default function SignupCard() {

    const [showPassword,setShowPassword] = useState(false);
    const [inputs,setInputs] = useState({
      name:"",
      username:"",
      email:"",
      password:""
    })
    const navigate = useNavigate();
    const [errors,setErrors] = useState({});

    const handleInputs = (e)=>{
      const {name,value} = e.target;

      setInputs({...inputs,[name]:value})
    }
    
    const handleSubmit = async()=>{
      const result = signUpSchema.safeParse(inputs);

      if(!result.success)
      {
        const fieldErrors = {};
        result.error.errors.forEach((err)=>{
          fieldErrors[err.path[0]] = err.message;
        })

        setErrors(fieldErrors);
        return;
      }

      try{
        const response = await axios.post('/users/signup',result.data);
        if(response.status === 201)
        {
          navigate('/login')
        }
      }
      catch(error)
      {
        console.log(error.response.data.message)
        error.response && toaster.create({
          description:error.response.data.message,
          type:"error",
          duration:3000
        })
      }
    }

    return (
        <Flex
            minH={'50vh'}
            align={'center'}
            justify={'center'}
        >
            <Stack gap={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={{base:"2xl",sm:"2xl",md:"3xl",lg:"4xl"}}>Register your account</Heading>
                    <Text fontSize={{base:"sm",sm:"sm",md:"md",lg:"lg"}} color={'gray.600'}>
                        to enjoy all of our cool <Text as={"span"} color={'blue.400'}>features</Text> ✌️
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}

                    boxShadow={'lg'}
                    p={8}>
                    <Stack gap={4}>
                        <Field.Root required >
                          <Field.Label htmlFor="name">
                            Name
                            <Field.RequiredIndicator/>
                          </Field.Label>
                          <Input type="text" id="name" name="name"
                          value={inputs.name}
                          onChange={handleInputs} />
                         {errors.name && <Text color={"red.400"}>{errors.name}</Text>} 

                          <Field.Label htmlFor="username">
                            Username
                            <Field.RequiredIndicator/>
                          </Field.Label>
                          <Input type="text" id="username" name="username"
                          value={inputs.username}
                          onChange={handleInputs}/>
                          {errors.username && <Text color={"red.400"}>{errors.username}</Text>}

                          <Field.Label htmlFor="email">
                            Email
                            <Field.RequiredIndicator/>
                          </Field.Label>
                          <Input type="email" id="email" name="email"
                          value={inputs.email}
                          onChange={handleInputs}/>
                          {errors.email && <Text color={"red.400"}>{errors.email}</Text>}

                          <Box position={"relative"} w="full">
                          <Field.Label htmlFor="password">
                            Password
                            <Field.RequiredIndicator/>
                          </Field.Label>
                          <Input type={showPassword?"text":"password"} id="password" name="password"
                          value={inputs.password}
                          onChange={handleInputs}/>

                          <Button position={"absolute"}
                          right="0px"
                          onClick={()=>setShowPassword((prev)=>!prev)}
                          variant={"plain"}>
                            {showPassword?<EyeOff/>:<Eye/>}
                          </Button>
                          {errors.password && <Text color={"red.400"}>{errors.password}</Text>}
                          </Box>
                        </Field.Root>

                        <Stack gap={10}>
                            <Button
                                bg={'red.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'red.500',
                                }}
                                onClick={handleSubmit}>
                                Sign Up
                            </Button>
                        </Stack>
                        <Text align={'center'}>
                            Already registered? <Link style={{color:'#6CB4EE'}}
                            to='/login'>Login</Link>
                        </Text>
                    </Stack>
                </Box>
            </Stack>
            <Toaster/>
        </Flex>
    )
}
