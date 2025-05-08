import { t } from 'i18next'
import { useEffect, useState } from 'react'
import { login, signup } from '../store/actions/user.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { getNiceColor } from '../services/util.service'
export function LoginForm() {
   const [isSignup, setIsSignup] = useState(false)
   const [credentials, setCredentials] = useState({
      username: '',
      password: '',
      fullname:'',
      color:'',
   })

   useEffect(() => {
      if (isSignup) {
         setCredentials(prev => ({
            ...prev,
            color: getNiceColor(),
         }))
      } else {
         setCredentials(prev => ({
            ...prev,
            fullname: '',
            color: '',
         }))
      }
   }, [isSignup])
   function handleChange(ev) {
      const { name, value } = ev.target
      setCredentials(prevState => ({ ...prevState, [name]: value }))
   }

   async function onLogin(ev) {
      ev.preventDefault()
      try {
         isSignup ? await signup(credentials) : await login(credentials)
         showSuccessMsg(t('Logged in successfully'))
      } catch (err) {
         console.log(t('Cannot login'), err)
         showErrorMsg(t('Cannot login'))
      }
   }
   if (!credentials) return <div>Loading...</div>
   return (
      <form className='login-form' onSubmit={onLogin}>
         <input
            onChange={handleChange}
            name='username'
            value={credentials.username}
            type='text'
            placeholder={t('Username')}
         />
         <input
            onChange={handleChange}
            name='password'
            value={credentials.password}
            type='password'
            placeholder={t('Password')}
         />
         {isSignup && (
            <input
               onChange={handleChange}
               name='fullname'
               value={credentials.fullname}
               type='text'
               placeholder={t('Fullname')}
            />
         )}
         <div className='form-btns'>
            <button className='btn2' type='submit'>
               {isSignup ? t('Signup') : t('Login')}
            </button>
            {/* {!isSignup && (
               <button className='btn2' onClick={() => setIsSignup(true)}>
                  {t('New user? Signup')}
               </button>
            )} */}

            {isSignup && (
               <button className='btn2' onClick={() => setIsSignup(false)}>
                  {t('Existing user? Login')}
               </button>
            )}
         </div>
      </form>
   )
}
