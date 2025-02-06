import React, { useState } from 'react'

import Background from "@/assets/login2.png"
import Victory from "@/assets/victory.svg"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api_client'
import { LOGIN_ROUTE, SIGN_ROUTE } from '@/utils/constants'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store'

const Auth = () => {
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const [confirmPassword , setConfirmPassword] = useState("")

    const { setUserInfo } = useAppStore()

    const navigate = useNavigate()

    const validateSignup = () => {
        if(!email.length) {
            toast.error("Email is required")
            return false
        }
        if(!password.length) {
            toast.error("Password is required")
            return false
        }

        if(password !== confirmPassword) {
            toast.error("Passwords should matche.")
            return false
        }

        return true
    }

    const validateLogin = () => {
        if(!email.length) {
            toast.error("Email is required")
            return false
        }
        if(!password.length) {
            toast.error("Password is required")
            return false
        }

        return true
    }

    const handleLogin = async () => {
        if(validateLogin()){
            try {
                const response = await apiClient.post(LOGIN_ROUTE , {email , password } , {
                    withCredentials: true,
                })
                console.log(response);
    
                if(response.status === 200){
                    setUserInfo(response?.data?.user)
                    if(response.data?.user?.profileSetup){
                        setEmail("")
                        setPassword("")
                        setConfirmPassword("")
                        toast.success("Login done successfully.")
                        navigate("/chat")
                    }else{
                        setEmail("")
                        setPassword("")
                        setConfirmPassword("")
                        toast.success("Login done successfully.")
                        navigate("/profile")
                    }
                }
            } catch (error) {
                console.log(error?.response?.data);
                toast.error(error?.response?.data)
            }
        }
    }

    const handleSignup = async () => {
        if(validateSignup()){
            try {
                const response = await apiClient.post(SIGN_ROUTE , {email , password} , {
                    withCredentials: true,
                })
                console.log(response);
                
                if(response.status === 201){
                    setUserInfo(response?.data?.user)
                    setEmail("")
                    setPassword("")
                    setConfirmPassword("")
                    toast.success("Sign up done successfully.")
                    navigate("/profile")
                }

            } catch (error) {
                console.log(error?.response?.data);
                toast.error(error?.response?.data)
            }
        }
    }
  return (
    <div className='min-h-[100vh] min-w-[100vw] flex items-center justify-center'>
        <div className='min-h-[80vh] bg-white border-2 pb-8 border-white text-opacity-90 shadow-2xl min-w-[80vw] md:min-w-[90vw] lg:min-w-[70vw] xl:min-w-[70vw] rounded-3xl grid xl:grid-cols-2'>
            <div className='flex flex-col gap-10 items-center justify-center'>
                <div className='flex items-center justify-center flex-col'>
                    <div className='flex items-center justify-center'>
                        <h1 className='text-5xl font-bold md:text-6xl'>Welcome</h1>
                        <img src={Victory} alt='victory-image' className='h-[100px]' />
                    </div>
                    <p className='font-medium text-center'>Fill in the details to get started with the best chat app</p>
                </div>
                <div className='flex items-center justify-center w-full'>
                    <Tabs className='w-3/4' defaultValue='login'>
                        <TabsList className="bg-transparent rounded-none w-full">
                            <TabsTrigger className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300" value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300" >Signup</TabsTrigger>
                        </TabsList>
                        <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                            <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <Input placeholder="Password" type="password" className="rounded-full p-6" value={password} onChange={(e) => setPassword(e.target.value)} />

                            <Button className="p-6 rounded-full" onClick={handleLogin}>Login</Button>
                        </TabsContent>
                        <TabsContent className="flex flex-col gap-5" value="signup">
                            <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <Input placeholder="Password" type="password" className="rounded-full p-6" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <Input placeholder="Confirm Password" type="password" className="rounded-full p-6" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                            <Button className="p-6 rounded-full" onClick={handleSignup}>Signup</Button>

                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <div className='hidden xl:flex justify-center items-center'>
                <img src={Background} alt='background-image' className='h-[700px] w-full' />
            </div>
        </div>
    </div>
  )
}

export default Auth