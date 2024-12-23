import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { loginWithGoogle } from '../store/actions/user.actions'
import { showSuccessMsg } from '../services/event-bus.service'

export function LoginWithGoogle() {
   async function onFailure(err) {
      console.log('Cannot login with google', err)
      throw err
   }
   async function onSuccess(response) {
      const { credential } = response
      try {
         const res = await loginWithGoogle(credential)
         if (res) {
            showSuccessMsg('Logged in successfully')
         }
      } catch (err) {
         console.log('Cannot login with google', err)
         throw err
      }
   }

   const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
   return (
      <section className='login-with-google'>
         <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
               buttonText='Login with Google'
               onSuccess={onSuccess}
               onFailure={onFailure}
               shape='rectangular'
               theme='outline'
               size='large'
               cookiePolicy={'single_host_origin'}
               text='signin_with'
               isSignedIn={true}/>
              
         </GoogleOAuthProvider>
      </section>
   )
}
