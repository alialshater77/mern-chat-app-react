import { useSocket } from '@/context/SocketContext'
import { apiClient } from '@/lib/api_client'
import { useAppStore } from '@/store'
import { UPLOAD_FILE } from '@/utils/constants'
import EmojiPicker from 'emoji-picker-react'
import React, { useEffect, useRef, useState } from 'react'
import {GrAttachment} from "react-icons/gr"
import { IoSend } from 'react-icons/io5'
import {RiEmojiStickerLine} from "react-icons/ri"
import { toast } from 'sonner'

const MessageBar = () => {
    const[message , setMessage] = useState("")
    const socket = useSocket()
    const {selectedChatType , selectedChatData , userInfo , setIsUploading , setIsDownloading , setFileUplaodProgress} = useAppStore()
    
    const[emaojiPickerOpen , setemaojiPickerOpen] = useState(false)

    const emojiRef = useRef(null)
    const fileInput = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if(emojiRef.current && !emojiRef.current.contains(event.target)){
                setemaojiPickerOpen(false)
            }
        }

        document.addEventListener("mousedown" , handleClickOutside)
        return () => {
            document.removeEventListener("mousedown" , handleClickOutside)
        }
    } , [emojiRef])


    const handleSendMessage = async () => {
        if(selectedChatType === 'contact'){
            socket.emit("sendMessage", {
                sender: userInfo.id,
                content: message,
                recipient: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined
            })
        }else if(selectedChatType === 'channel'){
            socket.emit("send-channel-message" , {
                sender: userInfo.id,
                content: message,
                messageType: "text",
                fileUrl: undefined,
                channelId: selectedChatData._id
            })
        }

        setMessage("")
    }

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji)
    }

    const handleAttachmentClick = () => {
        if(fileInput.current){
            fileInput.current.click()
        }
    }

    const handleAttchmentChange = async (event) => {
        try {
            const file = event.target.files[0]
            
            if(file){
                const formData = new FormData()
                formData.append("file", file)
                setIsUploading(true)
                const response = await apiClient.post(UPLOAD_FILE , formData , 
                    {withCredentials: true,
                        onUploadProgress: data => {
                            setFileUplaodProgress(Math.round((100*data.loaded) / data.total))
                        }
                    })

                if(response.status === 200 && response.data){
                    setIsUploading(false)
                    if(selectedChatType === "contact"){
                        socket.emit("sendMessage", {
                            sender: userInfo.id,
                            content: undefined,
                            recipient: selectedChatData._id,
                            messageType: "file",
                            fileUrl: response.data.filePath
                        })
                    }else if(selectedChatType === 'channel'){
                        socket.emit("send-channel-message" , {
                            sender: userInfo.id,
                            content: undefined,
                            messageType: "file",
                            fileUrl: response.data.filePath,
                            channelId: selectedChatData._id
                        })
                    }
                }
            }
        } catch (error) {
            console.log(error);
            setIsUploading(false)
            toast.error(error?.response?.data)
        }
    }
  return (
    <div className='h-[10vh] bg-[#1c1d25] flex justify-center items-center md:px-8 px-2 mb-6 gap-6'>
        <div className='flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5'>
            <input type='text' value={message} onChange={e => setMessage(e.target.value)} placeholder='Enter Message' className='flex-1 md:p-5 p-4 bg-transparent w-full rounded-md focus:border-none focus:outline-none' />
            <button onClick={handleAttachmentClick} className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
                <GrAttachment className='text-2xl' />
            </button>

            <input type='file' className='hidden' ref={fileInput} onChange={handleAttchmentChange} />

            <div className=' relative'>
                <button onClick={() => setemaojiPickerOpen(true)} className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
                    <RiEmojiStickerLine className='text-2xl' />
                </button>

                <div ref={emojiRef} className=' absolute bottom-16 right-0'>
                    <EmojiPicker className='sm:!h-[450px] !h-[347px] sm:!w-[350px] !w-[215px] sm:!left-0 !left-[27%]' theme='dark' open={emaojiPickerOpen} autoFocusSearch={false} onEmojiClick={handleAddEmoji} />
                </div>
            </div>
        </div>

        <button onClick={handleSendMessage} className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
            <IoSend className='md:text-2xl text-md' />
        </button>
    </div>
  )
}

export default MessageBar