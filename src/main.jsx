import React from 'react'
import ReactDOM from 'react-dom/client'

import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from "react-redux"

import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import './i18n'

import { store } from './store/store'
import { RootCmp } from './RootCmp'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<Provider store={store}>
		<Router>
			<RootCmp />
		</Router>
	</Provider>
)

// Register service worker with proper error handling
if (process.env.NODE_ENV === 'production') {
	serviceWorkerRegistration.register({
		onSuccess: (registration) => {
			console.log('Service Worker registered successfully:', registration)
		},
		onUpdate: (registration) => {
			console.log('New content is available; please refresh.', registration)
		}
	})
} else {
	serviceWorkerRegistration.unregister()
}
