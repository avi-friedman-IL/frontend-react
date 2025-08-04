import { useEffect, useState } from "react"
import { userService } from "../services/user"
import { addUser } from "../store/actions/user.actions"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service"
import { t } from "i18next"
import { MdClose } from "react-icons/md"

export function UserAdd({ setIsOpenAddUser }) {
    const [user, setUser] = useState(userService.getEmptyUser())
    
    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setUser(prevUser => ({ ...prevUser, [field]: value }))
    }
    
    async function handleSave(ev) {
        ev.preventDefault()
        try {
            await addUser(user)
            showSuccessMsg(t('User added successfully'))
            setIsOpenAddUser(false)
        } catch (err) {
            showErrorMsg(t('Error adding user'))
            console.log('err', err)
        }
    }
    
    return (
        <form className='user-add' onSubmit={handleSave}>
            <input type="text"
                name="fullname"
                placeholder={t('Fullname')}
                value={user.fullname}
                onChange={handleChange}
                required
            />
            <input type="text"
                name="username"
                placeholder={t('Username')}
                value={user.username}
                onChange={handleChange}
                required
            />
            <input type="text"
                name="password"
                placeholder={t('Password')}
                value={user.password}
                onChange={handleChange}
                required
            />
            
            {/* שדה בחירת מגדר */}
            <div className="gender-selector">
                <label htmlFor="gender">{t('Gender')}:</label>
                <select
                    name="gender"
                    id="gender"
                    value={user.gender}
                    onChange={handleChange}
                    className="gender-select"
                    required
                >
                    <option value="">{t('Select Gender')}</option>
                    <option value="male">{t('Male')}</option>
                    <option value="female">{t('Female')}</option>
                </select>
            </div>
            
            <button type="submit" className='save-btn btn3'>{t('Save')}</button>
            <button type="button" className='close-btn' onClick={() => setIsOpenAddUser(false)}>
                <MdClose />
            </button>
        </form>
    )
}
