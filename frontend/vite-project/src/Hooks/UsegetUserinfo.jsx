import axios from 'axios';
import React,{useState} from 'react'
import { useParams } from 'react-router-dom';
import { toaster } from '../components/ui/toaster';

const UsegetUserinfo = () => {

    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);
    const {username} = useParams();

    const getUser = async()=>{
        setLoading(true);

        try{
            const response = await axios.get(`/users/profile/${username}`);
            if(response.status === 200)
            {
                setUser(response.data.data);
            }
        }
        catch(error)
        {
            toaster.create({
                description:error.response?error.response.data.message:"Error occured",
                type:"error",
                duration:3000
            })
        }
        finally{
            setLoading(false);
        }
    }
  return {getUser,user,loading}
}

export default UsegetUserinfo