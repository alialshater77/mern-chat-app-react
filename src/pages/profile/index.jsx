import { useAppStore } from '@/store'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack} from "react-icons/io5"
import { FaTrash , FaPlus } from "react-icons/fa"
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { colors, getColor } from '@/utils/colors'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api_client'
import { DELETE_IMAGE, HOST, PROFILE_IMAGE, UPDATE_PROFILE } from '@/utils/constants'

const Profile = () => {
  const {userInfo , setUserInfo} = useAppStore()
  const[firstName , setFirstName] = useState('')
  const[lastName , setLastName] = useState('')
  const[image , setImage] = useState(null)
  const[hoverd , setHoverd] = useState(false)
  const[selectedColor , setSelectedColor] = useState(0)
  const fileInputRef = useRef(null)

  const navigate = useNavigate()

  useEffect(() => {
    if(userInfo.profileSetup){
      setFirstName(userInfo.firstName)
      setLastName(userInfo.lastName)
      setSelectedColor(userInfo.color)
    }
    if(userInfo.image){
      setImage(`${HOST}${userInfo.image}`)
    }
  } , [userInfo])

  const validateProfile = () => {
    if(!firstName){
      toast.error("First Name is required.")
      return false
    }
    if(!lastName){
      toast.error("Last Name is required.")
      return false
    }

    return true
  }

  const saveChanges = async (params) => {
    if(validateProfile()){
      try {
        const response = await apiClient.put(UPDATE_PROFILE , {firstName , lastName , color: selectedColor} , {withCredentials: true})

        if(response.status === 200 && response.data){
          setUserInfo({...response?.data})
          toast.success("Profile updated successfully.")
          navigate("/chat")
      }
      } catch (error) {
        console.log(error?.response?.data);
        toast.error(error?.response?.data)
      }
    }
  }

  const handleNavigate = () => {
    if(userInfo.profileSetup){
      navigate("/chat")
    }else{
      toast.error("Please setup your profile.")
    }
  }

  const handleInputFileClick = () => {
    fileInputRef.current.click()
    
  }

  const handleImageChange = async (event) => {
    const file = event.target.files[0]
    if(file){
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result)
      }

      reader.readAsDataURL(file)

      const formData = new FormData()
      formData.append("profile-image" , file)
      const response = await apiClient.post(PROFILE_IMAGE , formData , {withCredentials: true})

      if(response.status === 200 && response.data?.image){
        setUserInfo({...userInfo , image: response.data.image})
        toast.success("Image updated successfully.")
      }
    }
    
  }

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(DELETE_IMAGE, {withCredentials: true})

      if(response.status === 200){
        setUserInfo({...userInfo , image: null})
        toast.success("Image deleted successfully.")
        setImage(null)
      }
    } catch (error) {
      console.log(error?.response?.data);
      toast.error(error?.response?.data)
    }
  }


  return (
    <div className='bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10'>
      <div className='flex flex-col gap-10 w-[80vw] md:w-max'>
        <div className=''>
          <IoArrowBack onClick={handleNavigate} className='text-5xl lg:text-6xl text-white/90 cursor-pointer' />
        </div>

        <div className='grid md:grid-cols-2 grid-cols-1 md:gap-0 gap-10'>
          <div onMouseEnter={() => setHoverd(true)} onMouseLeave={() => setHoverd(false)} className='w-32 h-full md:w-48 md:h-48 relative flex items-center justify-center'>
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {
                image ? <AvatarImage src={image} alt="profile" className="object-cover w-full h-full bg-black" /> : 
                <div className={` uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>{
                    firstName ? firstName.split("").shift() : userInfo.email.split("").shift()
                  }</div>
              }
            </Avatar>
            {
              hoverd && (
                <div onClick={image ? handleDeleteImage : handleInputFileClick} className='absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full cursor-pointer'>
                  {
                    image ? <FaTrash className='text-white cursor-pointer text-3xl' /> : <FaPlus className='text-white cursor-pointer text-3xl' />
                  }
                </div>
              )
            }
            <input ref={fileInputRef} accept='.png, .jpg, .jpeg, .svg, .webp' name='profile-image' type='file' className='hidden' onChange={(e) => handleImageChange(e)} />
          </div>

          <div className='flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center'>
            <div className='w-full'>
              <Input placeholder="Email" type="email" disabled readOnly value={userInfo.email} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
            </div>
            <div className='w-full'>
              <Input placeholder="First Name" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="rounded-lg p-6 outline-none focus:outline-none focus:border-none bg-[#2c2e3b] border-none" />
            </div>
            <div className='w-full'>
              <Input placeholder="Last Name" type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="rounded-lg p-6 outline-none focus:outline-none focus:border-none bg-[#2c2e3b] border-none" />
            </div>

            <div className='flex gap-5 w-full'>
              {
                colors.map((color , index) => (
                  <div key={index} onClick={() => setSelectedColor(index)} className={`${color} h-8 w-8 rounded-full transition-all cursor-pointer duration-300 ${selectedColor === index ? "outline outline-white/50" : ""}`}></div>
                ))
              }
            </div>
          </div>
        </div>

        <div className='w-full'>
          <Button onClick={saveChanges} className="h-16 w-full bg-purple-700 transition-all duration-300 hover:bg-purple-900">Save Changes</Button>
        </div>
      </div>
    </div>
  )
}

export default Profile