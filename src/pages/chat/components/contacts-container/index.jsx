import Logo from '@/assets/Logo'
import Title from '@/components/ui/Title'
import React, { useEffect } from 'react'
import ProfileInfo from './components/profile-info'
import NewDm from './components/new-dm'
import { apiClient } from '@/lib/api_client'
import { GET_CONTACTS, GET_USER_CHANNELS } from '@/utils/constants'
import { useAppStore } from '@/store'
import ContactList from '@/components/Contact-List'
import CreateChannel from './components/create-channel'

const ContactsContainer = () => {
  const {setDirectMessagesContacts , directMessagesContacts , channels , setChannels} = useAppStore()
  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await apiClient.get(GET_CONTACTS , {withCredentials: true})

        if(response.data.contacts){
          setDirectMessagesContacts(response.data.contacts)
          
        }
      } catch (error) {
        console.log(error);
      }
    }


    const getChannels = async () => {
      try {
        const response = await apiClient.get(GET_USER_CHANNELS , {withCredentials: true})

        if(response.data.channels){
          setChannels(response.data.channels)
          
        }
      } catch (error) {
        console.log(error);
      }
    }

    getContacts()
    getChannels()
  }, [])

  return (
    <div className=' relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full'>
      <div className='pt-3'>
        <Logo />
      </div>

      <div className='my-5'>
        <div className='flex items-center justify-between pr-10'>
          <Title text="Direct Messages" />
          <NewDm />
        </div>

        <div className='max-h-[38vh] overflow-y-auto scrollbar-hidden'>
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className='my-5'>
        <div className='flex items-center justify-between pr-10'>
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className='max-h-[38vh] overflow-y-auto scrollbar-hidden'>
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>

      <ProfileInfo />
    </div>
  )
}

export default ContactsContainer