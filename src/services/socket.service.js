import io from 'socket.io-client'
import { userService } from './user'

const SOCKET_EMIT_LOGIN = 'login'
const SOCKET_EMIT_LOGOUT = 'logout'

let socket = null

const baseUrl = process.env.NODE_ENV === 'production' ? '' : '//localhost:3030'
// const baseUrl = '//localhost:3030'
// export const socketService = createSocketService()
// export const socketService = createDummySocketService()

// for debugging from console
// window.socketService = socketService

// socketService.setup()

export const socketService = {
   setup() {
      // console.log('Setting up socket...')
      socket = io(baseUrl, {
         transports: ['websocket', 'polling'],
         reconnectionAttempts: 5,
         reconnectionDelay: 1000,
         timeout: 20000,
      })
      // socket.on('connect', () => {
      //    console.log('Socket connected:', socket.id)
      // })
      // socket.on('disconnect', () => {
      //    console.log('Socket disconnected')
      // })
      const user = userService.getLoggedinUser()
      if (user) this.login(user._id)
   },
   on(eventName, cb) {
      socket.on(eventName, cb)
      // console.log('socketService - on:', eventName)
   },
   off(eventName, cb) {
      if (!socket) return
      if (!cb) socket.removeAllListeners(eventName)
      else {
         socket.off(eventName, cb)
      }
   },
   emit(eventName, data) {
      // console.log('Emitting event:', eventName, 'with data:', data)
      socket.emit(eventName, data)
   },
   login(userId) {
      // console.log('Logging in user:', userId)
      if (!socket) this.setup()
      socket.emit(SOCKET_EMIT_LOGIN, userId)
   },
   logout() {
      // console.log('Logging out user')
      socket.emit(SOCKET_EMIT_LOGOUT)
   },
   terminate() {
      if (socket) {
         // console.log('Terminating socket connection')
         socket.disconnect()
         socket = null
      }
   },
   getSocketId() {
      return socket ? socket.id : null
   },
   isConnected() {
      return socket && socket.connected
   },
}

function createDummySocketService() {
   var listenersMap = {}
   const socketService = {
      listenersMap,
      setup() {
         listenersMap = {}
      },
      terminate() {
         this.setup()
      },
      login() {
         console.log('Dummy socket service here, login - got it')
      },
      logout() {
         console.log('Dummy socket service here, logout - got it')
      },
      on(eventName, cb) {
         listenersMap[eventName] = [...(listenersMap[eventName] || []), cb]
      },
      off(eventName, cb) {
         if (!listenersMap[eventName]) return
         if (!cb) delete listenersMap[eventName]
         else
            listenersMap[eventName] = listenersMap[eventName].filter(
               l => l !== cb
            )
      },
      emit(eventName, data) {
         var listeners = listenersMap[eventName]
         if (eventName === SOCKET_EMIT_SEND_MSG) {
            listeners = listenersMap[SOCKET_EVENT_ADD_MSG]
         }

         if (!listeners) return

         listeners.forEach(listener => {
            listener(data)
         })
      },
      // Functions for easy testing of pushed data
      testChatMsg() {
         this.emit(SOCKET_EVENT_ADD_MSG, {
            from: 'Someone',
            txt: 'Aha it worked!',
         })
      },
      testUserUpdate() {
         this.emit(SOCKET_EVENT_USER_UPDATED, {
            ...userService.getLoggedinUser(),
            score: 555,
         })
      },
   }
   window.listenersMap = listenersMap
   return socketService
}

// Basic Tests
// function cb(x) {console.log('Socket Test - Expected Puk, Actual:', x)}
// socketService.on('baba', cb)
// socketService.on('baba', cb)
// socketService.on('baba', cb)
// socketService.on('mama', cb)
// socketService.emit('baba', 'Puk')
// socketService.off('baba', cb)
