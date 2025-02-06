import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { apiClient } from '@/lib/api_client'
import { CREATE_CHANNEL, GET_ALL_CONTACTS, HOST } from '@/utils/constants'
import { useAppStore } from '@/store'
import { Button } from '@/components/ui/button'
import MultipleSelector from '@/components/ui/multipleSelect'
  

const CreateChannel = () => {
    const [newChannelModel , setNewChannelModel] = useState(false)
    const [allContacts , setAllContacts] = useState([])
    const [selectedContacts , setSelectedContacts] = useState([])
    const [channelName , setChannelName] = useState("")

    const {setSelectedChatType , setSelectedChatData , addChannel} = useAppStore()

    useEffect(() => {
        const getData = async() => {
            const response = await apiClient.get(GET_ALL_CONTACTS , {
                withCredentials: true,
            })

            setAllContacts(response.data.contacts)
        }

        getData()
    },[])

    const createNewChannel = async () => {
        try {
            if(channelName.length >= 0 && selectedContacts.length > 0){
                const createdChannel = await apiClient.post(CREATE_CHANNEL , {
                    name: channelName,
                    members: selectedContacts.map((contact) => contact.value)
                },
                {withCredentials: true})

                if(createdChannel.status === 201){
                    setChannelName('')
                    setSelectedContacts([])
                    setNewChannelModel(false)
                    addChannel(createdChannel.data.channel)

                }
            }
        } catch (error) {
            console.log(error);
            
        }
    }

  return (
    <>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <FaPlus onClick={() => setNewChannelModel(true)} className='text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300' />
                </TooltipTrigger>
                <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                    Create New Contact
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

        <Dialog open={newChannelModel} onOpenChange={setNewChannelModel}>
            <DialogContent className="bg-[#181920] border-none text-white md:w-[400px] w-full h-[400px] flex flex-col">
                <DialogHeader>
                <DialogTitle>Please fill out the details for a new channel.</DialogTitle>
                </DialogHeader>

                <div className=''>
                    <Input onChange={e => setChannelName(e.target.value)} value={channelName} placeholder="Channel name" className="rounded-lg p-6 bg-[#2c2e3b] border-none outline-none focus-visible:outline-none focus-visible:ring-0" />
                </div>

                <div>
                    <MultipleSelector
                     className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
                     defaultOptions={allContacts}
                     placeholder="search Contacts"
                     value={selectedContacts}
                     onChange={setSelectedContacts}
                     emptyIndicator={
                        <p className='text-center text-lg leading-10 text-gray-600'>No result found.</p>
                     }
                    />
                </div>

                <Button onClick={createNewChannel} className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300">
                    Create Channel
                </Button>
            </DialogContent>
        </Dialog>


    </>
  )
}

export default CreateChannel