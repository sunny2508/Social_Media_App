import React, { useState } from 'react'
import {toaster,Toaster} from '../components/ui/toaster'

const Usepreviewimg = () => {

    const [imgurl,setImgurl] = useState(null);

    const handleImageChange = (e)=>{
        const file = e.target.files[0];
        if(file && file.type.startsWith('image'))
            {
               const reader = new FileReader();
    
               reader.onloadend = ()=>{
                setImgurl(reader.result);
               }
    
               reader.readAsDataURL(file);
            }
            else{
                toaster.create({
                    description:"Please select image file",
                    type:"error",
                    duration:3000
                })
                setImgurl(null);

            }
    }

    const clearImage  = (inputRef)=>{
        setImgurl(null);
        if(inputRef.current)
        {
            inputRef.current.value = ""
        }
    }
  return {handleImageChange,imgurl,setImgurl,clearImage}
}

export default Usepreviewimg