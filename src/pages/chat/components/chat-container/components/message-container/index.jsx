import { apiClient } from '@/lib/api_client'
import { useAppStore } from '@/store'
import { GET_CHANNEL_MESSAGES, GET_MESSAGES, HOST } from '@/utils/constants'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { MdFolderZip } from "react-icons/md"
import { IoMdArrowDown } from "react-icons/io"
import { IoCloseSharp, IoPause } from 'react-icons/io5'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getColor } from '@/utils/colors'

const MessageContainer = () => {
  const scrollRef = useRef()
  const [showImage , setShowImage] = useState(false)
  const [imageUrl , setImageUrl] = useState(null)

  const {selectedChatType , selectedChatData , isDownloading , userInfo , selectedChatMessages , setSelectedChatMessages , setIsDownloading , setFileDownloadProgress} = useAppStore()

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(GET_MESSAGES , {id: selectedChatData._id} , {withCredentials: true})

        if(response.data.messages){
          setSelectedChatMessages(response.data.messages)
        }
      } catch (error) {
        console.log(error);
        
      }
    }

    const getCHannelMessages = async () => {
      try {
        const response = await apiClient.get(`${GET_CHANNEL_MESSAGES}/${selectedChatData._id}` , {withCredentials: true})

        if(response.data.messages){
          setSelectedChatMessages(response.data.messages)
        }
      } catch (error) {
        console.log(error);
        
      }
    }
    
    if(selectedChatData._id){
      if(selectedChatType === "contact"){
        getMessages()
      }else if(selectedChatType === "channel"){
        getCHannelMessages()
      }
    }
  },[selectedChatData , selectedChatType , setSelectedChatMessages])

  useEffect(() => {
    if(scrollRef.current){
      scrollRef.current.scrollIntoView({ behavior: "smooth"})
    }
  } , [selectedChatMessages])


  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i
    return imageRegex.test(filePath)
  }

  const renderChannelMessages = (message) => {
    return (
      <div className={`mt-5 ${message.sender._id !== userInfo.id ? 'text-left' : 'text-right'}`}>
        {
          message?.messageType === "text" && (
            <div className={`${message.sender._id === userInfo.id ? 'bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50' : 'bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20'} border inline-block p-4 rounded my-1 ml-9 max-w-[50%] break-words`}>
              {message.content}
            </div>
          )
        }
        {
          message.messageType === "file" && (
            <div className={`${message.sender._id === userInfo.id ? 'bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50' : 'bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20'} border inline-block p-4 rounded my-1 md:max-w-[50%] w-full break-words`}>
              {
                checkIfImage(message.fileUrl) ? <div onClick={() => {
                  setShowImage(true)
                  setImageUrl(message.fileUrl)
                }} className=' cursor-pointer'>
                  <img src={`${HOST}${message.fileUrl}`} height={300} width={300} alt='' />
                </div> : <div className='relative flex items-center justify-center gap-5'>
                  <span className='text-white/80 text-3xl bg-black/20 rounded-full p-3'>
                    <MdFolderZip className='md:text-3xl text-xl' />
                  </span>
                  <span className='md:text-xl text-sm'>{message.fileUrl.split("/").pop()}</span>
                  <span onClick={() => downloadFile(message.fileUrl)} className={`bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300`}>
                    {!isDownloading ? <IoMdArrowDown className='md:text-3xl text-xl' /> : <IoPause className='md:text-3xl text-xl' />}
                  </span>
                </div>
              }
            </div>
          )
        }
        {
          message.sender._id !== userInfo.id ? (
            <div className='flex justify-start items-center gap-3'>
              <Avatar className="h-8 w-8 rounded-full overflow-hidden">
                {
                    message.sender.image && <AvatarImage src={`${HOST}${message.sender.image}`} alt="profile" className="object-cover w-full h-full bg-black" />
                }
                <AvatarFallback className={` uppercase h-8 w-8 text-lg flex items-center justify-center rounded-full ${getColor(message.sender.color)}`}>
                  {message.sender.firstName ? message.sender.firstName.split("").shift() : message.sender.email.split("").shift()}
                </AvatarFallback>
              </Avatar>
              <span className='text-sm text-white/60 '>{`${message.sender.firstName} ${message.sender.lastName}`}</span>
              <span className='text-xs text-white/60 '>{moment(message.timestamp).format("LT")}</span>
            </div>
          ) : (
            <div className='text-xs text-white/60 mt-1 '>{moment(message.timestamp).format("LT")}</div>
          )
        }
      </div>
    )
  }

  const renderMessages = () => {
    let lastDate = null

    return selectedChatMessages.map((message , index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD")
      const showDate = messageDate !== lastDate
      lastDate = messageDate
      return (
        <div key={index}>
          {
            showDate && <div className='text-center text-gray-500 my-2'>
              {moment(message.timestamp).format("LL")}
            </div>
          }
          {
            selectedChatType === "contact" && renderDMMessages(message)
          }
          {
            selectedChatType === "channel" && renderChannelMessages(message)
          }
        </div>
      )
    })
  }

  const downloadFile = async (file) => {
    setIsDownloading(true)
    setFileDownloadProgress(0)
    const response = await apiClient.get(`${HOST}${file}` , {
      responseType: "blob",
      onDownloadProgress: progress => {
        const {loaded , total} = progress
        const percentCompleted = Math.round((100*loaded) / total)
        setFileDownloadProgress(percentCompleted)
      }
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download" , file.split('/').pop())
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    setIsDownloading(false)
  }

  const renderDMMessages = (message) => {
    return(
      <div className={`${message.sender === selectedChatData._id ? 'text-left' : 'text-right' }`}>
        {
          message?.messageType === "text" && (
            <div className={`${message.sender !== selectedChatData._id ? 'bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50' : 'bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20'} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
              {message.content}
            </div>
          )
        }
        {
          message.messageType === "file" && (
            <div className={`${message.sender !== selectedChatData._id ? 'bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50' : 'bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20'} border inline-block p-4 rounded my-1 md:max-w-[50%] w-full break-words`}>
              {
                checkIfImage(message.fileUrl) ? <div onClick={() => {
                  setShowImage(true)
                  setImageUrl(message.fileUrl)
                }} className=' cursor-pointer'>
                  <img src={`${HOST}${message.fileUrl}`} height={300} width={300} alt='' />
                </div> : <div className='flex relative items-center justify-center gap-5'>
                  <span className='text-white/80 text-3xl bg-black/20 rounded-full p-3'>
                    <MdFolderZip className='md:text-3xl text-xl' />
                  </span>
                  <span>{message.fileUrl.split("/").pop()}</span>
                  <span onClick={() => downloadFile(message.fileUrl)} className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'>
                    
                    {
                      !isDownloading ? <IoMdArrowDown className='md:text-3xl text-xl' /> : <IoPause className='md:text-3xl text-xl' />
                    }
                  </span>
                </div>
              }
            </div>
          )
        }
        <div className='text-xs text-gray-600'>
          {
            moment(message.timestamp).format("LT")
          }
        </div>
      </div>
    )
  }
  return (
    <div className='flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full'>
        {renderMessages()}
        <div ref={scrollRef} />
        {
          showImage && <div className='fixed z-[1000] top-0 h-[100vh] w-[100vw] flex justify-center items-center backdrop-blur-lg left-0'>
            <div>
              <img src={`${HOST}${imageUrl}`} alt='image' className='md:h-[80vh] w-full bg-cover' />
            </div>

            <div className='flex gap-5 fixed top-0 mt-5'>
                  <button onClick={() => downloadFile(imageUrl)} className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'>
                    {!isDownloading ? <IoMdArrowDown /> : <IoPause />}
                  </button>
                  <button onClick={() => {
                    setShowImage(false)
                    setImageUrl(null)
                  }} className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'>
                    <IoCloseSharp />
                  </button>
            </div>
          </div>
        }
    </div>
  )
}

export default MessageContainer