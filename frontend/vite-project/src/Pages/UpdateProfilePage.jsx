import {
    Flex,
    Heading,
    Input,
    Stack,
    IconButton,
    Center,
    Field,Text
  } from '@chakra-ui/react'
  //import { SmallCloseIcon } from '@chakra-ui/icons'
  import { Avatar } from '../components/ui/avatar'
import { Button } from '../components/ui/button'
import { useRecoilState, useRecoilValue } from 'recoil'
import { userAtom } from '../atoms/useratom'
import { useRef, useState } from 'react';
import Usepreviewimg from '../Hooks/Usepreviewimg';
import { toaster, Toaster } from '../components/ui/toaster';
import axios from 'axios'
import { updateProfileSchema } from '../zod/userschema';
  
  export default function UpdateProfilePage() {
    
    const [user,setUser] = useRecoilState(userAtom);

    const [inputs,setInputs] = useState({
      name:user.name,
      username:user.username,
      email:user.email,
      bio:user.bio,
      password:"",
      profilePic:user.profilePic
    });
    const [errors,setErrors] = useState({});
    const [updating,setUpdating] = useState(false);
     
    const {handleImageChange,imgurl} = Usepreviewimg();

    const handleInputs = (e)=>{
      const{name,value}  = e.target;
      

      setInputs({...inputs,[name]:value});
    }

    const handleSubmit = async(e)=>{

      e.preventDefault();

      if(updating)
      {
        return;
      }

      setUpdating(true);

      const processedInputs = {...inputs};
      if(!processedInputs.password)
      {
        delete processedInputs.password
      }

      const result = updateProfileSchema.safeParse(processedInputs);

      if(!result.success)
      {
        const fieldErrors = {};
        result.error.errors.forEach((err)=>{
          fieldErrors[err.path[0]] = err.message;
        })

        setErrors(fieldErrors);
        console.log(fieldErrors);
        return;
      }
      try{
        const response = await axios.put(`/users/updateprofile/${user._id}`,{...result.data,profilePic:imgurl||user.profilePic});
        if(response.status === 200)
        {
          toaster.create({
            description:response.data?response.data.message:"Profile updated successfully",
            type:"success",
            duration:3000
          })
          setUser((prevUser)=>({
            ...prevUser,
            ...response.data,
            profilePic:imgurl||prevUser.profilePic
          }));
        }
      }
      catch(error)
      {
        console.log(error.response?error.response.data.message:"Error occured")
        toaster.create({
          description:error.response?error.response.data.message:"Error occured",
          type:"error",
          duration:3000
        })
      }
      finally{
        setUpdating(false)
      }
    }
    const fileRef = useRef(null);


    return (
      <form onSubmit={handleSubmit}>
      <Flex
        align={'center'}
        justify={'center'}
        w='full'>
        <Stack
          gap={4}
          w={'full'}
          maxW={'md'}
          bg='gray.900'
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            User Profile Edit
          </Heading>

          
            <Stack direction={{base:'column', md:'row'}} gap={6}>
              <Center>
                <Avatar size="2xl"  boxShadow={"md"}src={imgurl ||user.profilePic}/>
                
              </Center>
              <Center w="full">
                <Button w="full" onClick={()=>fileRef.current.click()}>Change Icon</Button>
                <Input type="file" hidden ref={fileRef} onChange={handleImageChange}/>
              </Center>
            </Stack>

          <Field.Root>
            <Field.Label htmlFor="name">
                Name
            </Field.Label>
            <Input type="text" id="name" name="name"
            placeholder='John Doe' value={inputs.name} onChange={handleInputs}/>
            {errors.name && <Text>{errors.name}</Text>}

            <Field.Label htmlFor='username'>
                Username
            </Field.Label>
            <Input type="text" id="username" name="username"
            placeholder='johndoe' value={inputs.username} onChange={handleInputs}/>
           {errors.username && <Text>{errors.username}</Text>}

            <Field.Label htmlFor='email'>
                Email
            </Field.Label>
            <Input type="email" id="email" name="email"
            placeholder='abc@gmail.com' value={inputs.email} onChange={handleInputs}/>
            {errors.email && <Text>{errors.email}</Text>}

            <Field.Label htmlFor='bio'>
                Bio
            </Field.Label>
            <Input type="text" id="bio" name="bio"
            placeholder='hello' value={inputs.bio} onChange={handleInputs}/>
            {errors.bio && <Text>{errors.bio}</Text>}

            <Field.Label htmlFor='password'>
                Password
            </Field.Label>
            <Input type="password" id="password" name="password"
            value={inputs.password} onChange={handleInputs}/>
           {errors.password && <Text>{errors.password}</Text>}

<Stack gap={6} direction={{base:'column',sm:'row',md:'row'}} my={6}>
            <Button
              bg={'red.400'}
              color={'white'}
              w={{sm:'full',md:'full'}}
              _hover={{
                bg: 'red.500',
              }}>
              Cancel
            </Button>
            <Button
              bg={'blue.400'}
              color={'white'}
              w={{sm:'full',md:'full'}}
              _hover={{
                bg: 'blue.500',
              }}
              type="submit"
              loading={updating}>
              Submit
            </Button>
          </Stack>
          </Field.Root>
          
        </Stack>
        <Toaster/>
      </Flex>
      </form>
    )
  }