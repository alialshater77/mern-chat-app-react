import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './store'
import { useEffect, useState } from 'react'
import { apiClient } from './lib/api_client'
import { GET_USER_INFO } from './utils/constants'

const PrivateRoutes = ({children}) => {
  const {userInfo} = useAppStore()
  const isAuthenticated = !!userInfo
  return isAuthenticated ? children : <Navigate to="/auth" />
}

const AuthRoute = ({children}) => {
  const {userInfo} = useAppStore()
  const isAuthenticated = !!userInfo
  return isAuthenticated ? <Navigate to="/chat" /> : children
}

const App = () => {
  const {userInfo , setUserInfo} = useAppStore()
  const [loading , setLoading] = useState(true)

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO , {withCredentials: true})
        console.log(response);
        if(response.status === 200 && response.data.user.id) {
          setUserInfo(response.data.user)
        }else{
          setUserInfo(undefined)
        }
        
      } catch (error) {
        console.log(error);
        setUserInfo(undefined)
      } finally{
        setLoading(false)
      }
    }

    if(!userInfo){
      getUserData()
    }else{
      setLoading(false)
    }
  } , [userInfo , setUserInfo])

  if(loading){
    return <div>...loading</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={
          <AuthRoute>
            <Auth />
          </AuthRoute>} />
        <Route path='/chat' element={
          <PrivateRoutes>
            <Chat />
          </PrivateRoutes>} />
        <Route path='/profile' element={
          <PrivateRoutes>
            <Profile />
          </PrivateRoutes>} />
        <Route path='*' element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App