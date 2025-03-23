import { socketService } from './socket.service'

// פונקציית עזר להמתנה
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// מערך לשמירת כל המאזינים שנרשמו
const listeners = new Set()

// פונקציית עזר לניקוי מאזינים
const cleanupListeners = () => {
    listeners.forEach(({ event, callback }) => {
        socketService.off(event, callback)
    })
    listeners.clear()
}

// בדיקת התחברות בסיסית
async function testBasicConnection() {
    console.log('🧪 Testing basic connection...')
    try {
        await socketService.setup()
        const isConnected = socketService.isConnected()
        console.log('Connection status:', isConnected ? '✅ Connected' : '❌ Not connected')
        return isConnected
    } catch (err) {
        console.error('❌ Basic connection failed:', err)
        return false
    }
}

// בדיקת התחברות וניתוק מרובים
async function testMultipleConnections() {
    console.log('🧪 Testing multiple connections...')
    try {
        for (let i = 0; i < 5; i++) {
            console.log(`Connection attempt ${i + 1}`)
            await socketService.setup()
            if (!socketService.isConnected()) {
                throw new Error(`Failed to connect on attempt ${i + 1}`)
            }
            socketService.terminate()
            await wait(500)
        }
        console.log('✅ Multiple connections test passed')
        return true
    } catch (err) {
        console.error('❌ Multiple connections test failed:', err)
        return false
    }
}

// בדיקת שליחת הודעות
async function testMessageEmission() {
    console.log('🧪 Testing message emission...')
    try {
        const testMessages = [
            { event: 'test-event-1', data: 'Test message 1' },
            { event: 'test-event-2', data: { key: 'value' } },
            { event: 'test-event-3', data: [1, 2, 3] }
        ]

        for (const msg of testMessages) {
            const success = await socketService.emit(msg.event, msg.data)
            console.log(`Message ${msg.event}:`, success ? '✅ Sent' : '❌ Failed')
            if (!success) throw new Error(`Failed to emit message: ${msg.event}`)
        }

        console.log('✅ Message emission test passed')
        return true
    } catch (err) {
        console.error('❌ Message emission test failed:', err)
        return false
    }
}

// בדיקת קבלת הודעות
async function testMessageReception() {
    console.log('🧪 Testing message reception...')
    try {
        const receivedMessages = []
        const testEvent = 'test-reception'

        const messageHandler = (data) => {
            receivedMessages.push(data)
            console.log('✅ Received message:', data)
        }

        socketService.on(testEvent, messageHandler)
        listeners.add({ event: testEvent, callback: messageHandler })

        // שליחת הודעת בדיקה
        await socketService.emit(testEvent, 'Test message')
        
        await wait(1000)
        console.log(`Messages received: ${receivedMessages.length}`)
        return receivedMessages.length > 0
    } catch (err) {
        console.error('❌ Message reception test failed:', err)
        return false
    }
}

// בדיקת התנהגות בניתוק
async function testDisconnectionBehavior() {
    console.log('🧪 Testing disconnection behavior...')
    try {
        await socketService.setup()
        
        let disconnectDetected = false
        let reconnectDetected = false

        const disconnectHandler = () => {
            disconnectDetected = true
            console.log('✅ Disconnect detected')
        }

        const connectHandler = () => {
            reconnectDetected = true
            console.log('✅ Reconnect detected')
        }

        socketService.on('disconnect', disconnectHandler)
        socketService.on('connect', connectHandler)
        
        listeners.add({ event: 'disconnect', callback: disconnectHandler })
        listeners.add({ event: 'connect', callback: connectHandler })

        // גורם לניתוק מכוון
        socketService.terminate()
        await wait(1000)

        // מנסה להתחבר מחדש
        await socketService.setup()
        await wait(1000)

        console.log('Disconnect detected:', disconnectDetected)
        console.log('Reconnect detected:', reconnectDetected)

        return disconnectDetected && reconnectDetected
    } catch (err) {
        console.error('❌ Disconnection behavior test failed:', err)
        return false
    }
}

// בדיקת ניסיונות שליחה מחדש
async function testRetryBehavior() {
    console.log('🧪 Testing retry behavior...')
    try {
        // מנתק את החיבור
        socketService.terminate()
        
        let retryCount = 0
        const maxRetries = 3

        // מנסה לשלוח הודעה כשמנותק
        while (retryCount < maxRetries) {
            console.log(`Retry attempt ${retryCount + 1}`)
            const success = await socketService.emit('test-retry', 'Retry message')
            if (success) {
                console.log(`✅ Message sent successfully after ${retryCount + 1} attempts`)
                return true
            }
            retryCount++
            await wait(1000)
        }

        throw new Error('Failed to send message after max retries')
    } catch (err) {
        console.error('❌ Retry behavior test failed:', err)
        return false
    }
}

// בדיקת שמירת הודעות ושליחה מחדש
async function testPendingEmits() {
    console.log('🧪 Testing pending emits...')
    try {
        // מנתק את החיבור
        socketService.terminate()
        
        // מנסה לשלוח כמה הודעות כשמנותק
        const messages = [
            { event: 'pending-1', data: 'Pending message 1' },
            { event: 'pending-2', data: 'Pending message 2' },
            { event: 'pending-3', data: 'Pending message 3' }
        ]

        for (const msg of messages) {
            await socketService.emit(msg.event, msg.data)
        }

        // מתחבר מחדש
        await socketService.setup()
        await wait(2000) // ממתין לשליחה מחדש

        console.log('✅ Pending emits test completed')
        return true
    } catch (err) {
        console.error('❌ Pending emits test failed:', err)
        return false
    }
}

// הרצת כל הבדיקות
async function runAllTests() {
    console.log('🚀 Starting socket service tests...')
    
    const tests = [
        { name: 'Basic Connection', fn: testBasicConnection },
        { name: 'Multiple Connections', fn: testMultipleConnections },
        { name: 'Message Emission', fn: testMessageEmission },
        { name: 'Message Reception', fn: testMessageReception },
        { name: 'Disconnection Behavior', fn: testDisconnectionBehavior },
        { name: 'Retry Behavior', fn: testRetryBehavior },
        { name: 'Pending Emits', fn: testPendingEmits }
    ]

    const results = []

    for (const test of tests) {
        console.log(`\n📋 Running test: ${test.name}`)
        try {
            const success = await test.fn()
            results.push({ name: test.name, success })
        } catch (err) {
            results.push({ name: test.name, success: false, error: err })
        }
        await wait(1000) // המתנה בין בדיקות
    }

    // ניקוי מאזינים
    cleanupListeners()

    // הצגת סיכום
    console.log('\n📊 Test Results:')
    results.forEach(result => {
        const status = result.success ? '✅ PASS' : '❌ FAIL'
        console.log(`${status} - ${result.name}`)
        if (!result.success && result.error) {
            console.error(`   Error: ${result.error.message}`)
        }
    })

    const passCount = results.filter(r => r.success).length
    console.log(`\n🎯 Final Score: ${passCount}/${results.length} tests passed`)
}

// הפעלת הבדיקות
runAllTests().catch(console.error)

// חשיפת הפונקציות לבדיקה ידנית מהקונסול
window.socketTests = {
    runAllTests,
    testBasicConnection,
    testMultipleConnections,
    testMessageEmission,
    testMessageReception,
    testDisconnectionBehavior,
    testRetryBehavior,
    testPendingEmits
} 