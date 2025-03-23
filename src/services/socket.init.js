import { socketService } from './socket.service'
import { userService } from './user'
import { store } from '../store/store'
import { UPDATE_USER } from '../store/reducers/user.reducer'

let statusInterval = null
let isInitialized = false
let globalListeners = new Set()

export async function initSocketService() {
    // מונע אתחול כפול
    if (isInitialized) {
        console.debug('Socket service already initialized')
        return socketService
    }

    try {
        // ניקוי מאזינים וintervals קודמים אם קיימים
        cleanup()
        
        // אתחול בכניסה לאפליקציה
        await socketService.setup()
        
        // חיבור מחדש אם המשתמש מחובר
        const loggedInUser = userService.getLoggedinUser()
        if (loggedInUser) {
            await socketService.login(loggedInUser._id)
        }
        
        // הוספת מאזינים גלובליים
        setupGlobalListeners()

        // הפעלת לוגר מצב חיבור בסביבת פיתוח
        if (process.env.NODE_ENV === 'development') {
            startConnectionStatusLog()
        }

        // הוספת מאזין לרענון הדף
        window.addEventListener('beforeunload', cleanup)
        
        isInitialized = true
        return socketService
    } catch (error) {
        console.error('Failed to initialize socket service:', error)
        cleanup()
        // ננסה להתחבר שוב אחרי 3 שניות רק אם לא מנסים כבר להתחבר
        if (!socketService.isReconnecting()) {
            setTimeout(() => {
                initSocketService()
            }, 3000)
        }
    }
}

function setupGlobalListeners() {
    const addGlobalListener = (event, callback) => {
        socketService.on(event, callback)
        globalListeners.add({ event, callback })
    }

    // עדכון נתוני משתמש
    addGlobalListener('user-update', user => {
        store.dispatch({ type: UPDATE_USER, user })
    })

    // ניתן להוסיף כאן מאזינים גלובליים נוספים
}

function startConnectionStatusLog() {
    // ניקוי interval קודם אם קיים
    if (statusInterval) {
        clearInterval(statusInterval)
    }
    
    statusInterval = setInterval(() => {
        const status = socketService.isConnected() 
            ? 'Connected' 
            : socketService.isReconnecting()
                ? 'Reconnecting...'
                : 'Disconnected'
        console.debug(`Socket connection status: ${status}`)
    }, 30000) // כל 30 שניות
}

function cleanup() {
    console.debug('Cleaning up socket connections and intervals...')
    
    // ניקוי intervals
    if (statusInterval) {
        clearInterval(statusInterval)
        statusInterval = null
    }
    
    // ניקוי מאזינים גלובליים
    globalListeners.forEach(({ event, callback }) => {
        socketService.off(event, callback)
    })
    globalListeners.clear()
    
    // ניקוי מאזינים וסוקט
    socketService.terminate()
    
    // הסרת מאזין רענון הדף
    window.removeEventListener('beforeunload', cleanup)

    isInitialized = false
}

// חשיפת פונקציות לשימוש חיצוני
export { cleanup } 