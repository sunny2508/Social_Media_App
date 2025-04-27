import { Container,Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Routes,Route, Navigate, replace } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import UserPage from './Pages/UserPage'
import Header from './Custom-Components/Header'
import PostPage from './Pages/PostPage'
import axios from 'axios'
import LoginPage from './Pages/LoginPage'
import SignupPage from './Pages/SignupPage'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { isCheckingAuth, loadingatom, userAtom } from './atoms/useratom'
import { LogoutButton } from './Custom-Components/LogoutButton'
import UpdateProfilePage from './Pages/UpdateProfilePage'
import ProtectedRoute from './Custom-Components/ProtectedRoute'
import CreatePost from './Custom-Components/CreatePost'


axios.defaults.baseURL="http://localhost:3000/api/v1",
axios.defaults.withCredentials=true;


function App() {
  
  const [user,setUser] = useRecoilState(userAtom);

  //const [Loading,setLoading] = useRecoilState(loadingatom);
  const isCheckingAuthState = useRecoilValue(isCheckingAuth);
  const setcheckingAuth = useSetRecoilState(isCheckingAuth);

  const authCheck = async()=>{
    setcheckingAuth(true);

    try{
      const response = await axios.get('/users/checkauth');
    if(response.status === 200)
    {
      setUser(response.data.data);
      setcheckingAuth(false);
    }
    }
    catch(error)
    {
      setUser(null);
      setcheckingAuth(false);
    }
  }

useEffect(()=>{
  authCheck();
},[]);

if(isCheckingAuthState) return <Text>Loading...</Text>
  
  return (
    <Container maxW={"620px"}>
      <Header/>
     <Routes>
      <Route path='/' element={<ProtectedRoute>
        <HomePage/>
      </ProtectedRoute>}/>
      <Route path='/login' element={!user?<LoginPage/>:<Navigate to='/'/>}/>
      <Route path='/signup' element={<SignupPage/>}/>
      <Route path='/updateprofile' element={<ProtectedRoute>
        <UpdateProfilePage/>
      </ProtectedRoute>}/>
      <Route path='/:username' element={user?(<>
       <UserPage/>
       <CreatePost/>
      </>):(<UserPage/>)}/>
      <Route path='/:username/post/:pid' element={<PostPage/>}/>
     </Routes>

     {/* {user && <LogoutButton/>} */}
    </Container>
  )
}

export default App

//<Route path='/' element={user?<HomePage/>:<Navigate to='/login'/>}/>
//<Route path='/updateProfile' element={user?<UpdateProfilePage/>:<Navigate to="/login"/>}/>