import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import Lottie from 'react-lottie'
import { animations } from '@/utils/animations'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api_client'
import { HOST, SEARCH_CONTACTS } from '@/utils/constants'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { getColor } from '@/utils/colors'
import { useAppStore } from '@/store'
  

const NewDm = () => {
    const [openNewContactModel , setOpenNewContactModel] = useState(false)
    const [searchContacts , setSearchContacts] = useState([])

    const {setSelectedChatType , setSelectedChatData} = useAppStore()
    
    const searchOnContacts = async (search) => {
        try {
            if(search.length > 0){
                const response = await apiClient.post(SEARCH_CONTACTS , {searchTerm :search} , {withCredentials: true})

                if(response.status === 200 && response.data.contacts){
                    setSearchContacts(response.data.contacts)
                }
            }else{
                setSearchContacts([])
            }
            
        } catch (error) {
            console.log(error?.response?.data);
            toast.error(error?.response?.data)
        }
    }

    const selectContact = (contact) => {
        setOpenNewContactModel(false)
        setSelectedChatType("contact")
        setSelectedChatData(contact)
        setSearchContacts([])
    }
  return (
    <>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <FaPlus onClick={() => setOpenNewContactModel(true)} className='text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300' />
                </TooltipTrigger>
                <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                    Select New Contact
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

        <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
            <DialogContent className="bg-[#181920] border-none text-white md:w-[400px] w-full h-[400px] flex flex-col">
                <DialogHeader>
                <DialogTitle>Please select a contact.</DialogTitle>
                </DialogHeader>

                <div className=''>
                    <Input onChange={e => searchOnContacts(e.target.value)} placeholder="search contacts" className="rounded-lg p-6 bg-[#2c2e3b] border-none outline-none focus-visible:outline-none focus-visible:ring-0" />
                </div>

                <ScrollArea className="max-h-[250px]">
                    <div className='flex flex-col gap-5'>
                        {
                            searchContacts.map((contact , i) => (
                                <div onClick={() => selectContact(contact)} className='flex gap-3 items-center cursor-pointer' key={contact._id}>
                                    <div className='w-10 h-10 relative'>
                                        <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                                            {
                                                contact.image ? <AvatarImage src={`${HOST}${contact.image}`} alt="profile" className="object-cover rounded-full w-full h-full bg-black" /> : 
                                                <div className={` uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}>{
                                                    contact.firstName ? contact.firstName.split("").shift() : contact.email.split("").shift()
                                                }</div>
                                            }
                                        </Avatar>
                                    </div>

                                    <div className='flex flex-col'>
                                        <span>
                                        {
                                            contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : `${contact?.email}`
                                        }
                                        </span>

                                        <span className='text-xs'>{contact.email}</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </ScrollArea>

                {
                    searchContacts.length <= 0 && (
                        <div className='flex-1 md:bg-[#1c1d25] mt-5 flex flex-col justify-center items-center duration-1000 transition-all'>
                            <Lottie isClickToPauseDisabled={true} height={100} width={100} options={animations} />

                            <div className='text-opacity-80 text-white flex flex-col items-center gap-5 mt-5 lg:text-2xl text-xl transition-all duration-300 text-center'>
                                <h3 className='poppins-medium '>
                                    Hi <span className='text-purple-500'>!</span> Search new <span className='text-purple-500'> Contact. </span>
                                </h3>
                            </div>
                        </div>
                    )
                }
            </DialogContent>
        </Dialog>


    </>
  )
}

export default NewDm