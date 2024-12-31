import Select from 'react-select'
import {
   loadUser,
   updateLoggedUser,
   updateUser,
} from '../store/actions/user.actions'
import { useEffect, useRef, useState } from 'react'
import { makeId } from '../services/util.service'
import { t } from 'i18next'

export function CreateGroup({ user, users, contacts, setIsOpen }) {
   const [group, setGroup] = useState({ id: '', name: '', members: [] })
   const createRef = useRef(null)
   
    useEffect(() => {
         function handleClickOutside(event) {
            if (
               createRef.current &&
               !createRef.current.contains(event.target)
            ) {
               setIsOpen(false)
            }
         }  
         document.addEventListener('mousedown', handleClickOutside)
         return () => {
            document.removeEventListener('mousedown', handleClickOutside)
         }
      }, [])
   
   const options = contacts.map(contact => ({
      value: contact._id,
      label: contact.fullname,
   })).filter(contact => contact.value !== user._id)

   function handleChange(ev) {
      setGroup({ ...group, id: makeId(), name: ev.target.value })
   }

   function handleSelectChange(selected) {
      const members = selected.map(member => ({
         _id: member.value,
         fullname: member.label,
      }))
      const membersToSave = [...members, { _id: user._id, fullname: user.fullname }]
      setGroup({ ...group, members: membersToSave })
   }

   async function onSave() {
      if (!group.name) return
      const loggedUser = { ...user }
      const updatedUser = {
         ...loggedUser,
         groups: loggedUser?.groups?.length
            ? [...loggedUser.groups, group]
            : [group],
      }

      users.forEach(async currUser => {
         if (group.members.some(member => member._id === currUser._id)) {
            currUser.groups = currUser?.groups?.length
               ? [...currUser.groups, group]
               : [group]
            const updatedUser = { ...currUser, groups: currUser.groups }
            await updateUser(updatedUser)
         }
      })

      try {
         await updateLoggedUser(updatedUser)
      } catch (err) {
         console.log('Cannot create group', err)
      }

      setIsOpen(false)
      console.log('user:', user)
   }

   return (
      <section className='create-group' ref={createRef}>
         <input type='text' placeholder={t('name of group')} onChange={handleChange} autoFocus />
         <Select
            isMulti
            options={options}
            onChange={handleSelectChange}
            className='select'
            placeholder={t('select members')}
         />
         <button className='btn' onClick={onSave}>
            {t('save')}
         </button>
      </section>
   )
}
