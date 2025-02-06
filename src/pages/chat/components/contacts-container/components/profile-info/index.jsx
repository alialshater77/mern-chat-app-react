import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useAppStore } from '@/store'
import { getColor } from '@/utils/colors'
import { HOST, LOGOUT_ROUTE } from '@/utils/constants'
import { FiEdit2 } from "react-icons/fi"
import { IoLogOut, IoPowerSharp } from "react-icons/io5"
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@/lib/api_client'
import { toast } from 'sonner'

const ProfileInfo = () => {
    const { userInfo , setUserInfo } = useAppStore()
    const navigate = useNavigate()

    const logout = async () => {
        try {
            const response = await apiClient.post(LOGOUT_ROUTE , {} , {withCredentials: true})

            if(response.status === 200){
                toast.success("Logout successfull.")
                setUserInfo(null)
                navigate('/auth')
            }
        } catch (error) {
            console.log(error?.response?.data);
            toast.error("Somthing went wrong, please try again.")
        }
    }

  return (
    <div className=' absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]'>
        <div className='flex gap-3 items-center justify-center'>
            <div className='w-10 h-10 relative'>
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                    {
                        userInfo.image ? <AvatarImage src={`${HOST}/${userInfo.image}`} alt="profile" className="object-cover w-full h-full bg-black" /> : 
                        <div className={` uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)}`}>{
                            userInfo.firstName ? userInfo.firstName.split("").shift() : userInfo.email.split("").shift()
                        }</div>
                    }
                </Avatar>
            </div>

            <div className='text-sm'>
                {
                    userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""
                }
            </div>
        </div>

        <div className='flex gap-5'>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FiEdit2 onClick={() => navigate('/profile')} className='text-purple-500 text-xl font-medium' />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                    <p>Edit Your Profile</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <IoPowerSharp onClick={() => logout()} className='text-red-500 text-xl font-medium' />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                    <p>Logout</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

        </div>
    </div>
  )
}

export default ProfileInfo