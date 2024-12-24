import Select from 'react-select'
import {
   loadUser,
   updateLoggedUser,
   updateUser,
} from '../store/actions/user.actions'
import { useState } from 'react'
import { makeId } from '../services/util.service'

export function CreateGroup({ user, users, contacts, setIsOpen }) {
   const [group, setGroup] = useState({ id: '', name: '', members: [] })
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
      <section className='create-group'>
         <h3>Create a group</h3>
         <input type='text' placeholder='Group name' onChange={handleChange} />
         <Select
            isMulti
            options={options}
            onChange={handleSelectChange}
            className='select'
         />
         <button className='btn' onClick={onSave}>
            Create
         </button>
      </section>
   )
}
