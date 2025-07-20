import io from 'socket.io-client'
import { userService } from './user'

export const SOCKET_EVENT_CHAT_ADDED = 'chat-added'
export const SOCKET_EVENT_CHAT_REMOVED = 'chat-removed'
export const SOCKET_EVENT_CHAT_UPDATED = 'chat-updated'
export const SOCKET_EVENT_USER_UPDATED = 'user-updated'
export const SOCKET_EMIT_LOGIN = 'set-user-socket'
export const SOCKET_EMIT_LOGOUT = 'unset-user-socket'

const baseUrl = (process.env.NODE_ENV === 'production') ? '' : '//localhost:3030'

export const socketService = createSocketService()
socketService.setup()

function createSocketService() {
    var socket = null
    const socketService = {
        setup() {
            socket = io(baseUrl)
            const user = userService.getLoggedinUser()
            if (user) this.login(user._id)
        },
        on(eventName, cb) {
            socket.on(eventName, cb)
        },
        off(eventName, cb) {
            socket.off(eventName, cb)
        },
        emit(eventName, data) {
            socket.emit(eventName, data)
        },
        login(userId) {
            socket.emit(SOCKET_EMIT_LOGIN, userId)
        },
        logout() {
            socket.emit(SOCKET_EMIT_LOGOUT)
        },
        terminate() {
            socket = null
        },
        isConnected() {
            return socket.connected
        }
    }
    return socketService
}