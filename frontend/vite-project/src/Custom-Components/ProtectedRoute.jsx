import React from 'react'
import { useRecoilValue } from 'recoil'
import { isCheckingAuth, userAtom } from '../atoms/useratom'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({children}) => {
    const user = useRecoilValue(userAtom);
    const isCheckingAuthState = useRecoilValue(isCheckingAuth);

    if (isCheckingAuthState) return <Text>Loading...</Text>;
    
    if(!user)
    {
     return  <Navigate to='/login' replace/>
    }

    return children;
}

export default ProtectedRoute