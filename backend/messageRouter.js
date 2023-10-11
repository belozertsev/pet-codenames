/*
	Its assumed that the messages passed to the function are valid JSON objects

	Authorizes the websocket connection and, if successful, calls the appropriate handler
	(first message in ws must be an authorization one)
*/

const authController = require('./controllers/authController.js')

async function routeIncomingMessage(wsServer, wsClient, message) {
	if (!wsClient.hasOwnProperty('isAuth')) {
		if (message.hasOwnProperty('sender') && message.hasOwnProperty('token')) {
			wsClient.send(JSON.stringify({
				type: 'auth',
				data: 'Authorized'
			}))
			return wsClient.isAuth = await authController.isAuth(message.sender, message.token)
		}
	}

	if (!wsClient.isAuth) {
		wsClient.send(JSON.stringify({
			type: 'error',
			data: 'Not authorized'
		}))
		return wsClient.close()
	}

	// TODO: rework this using TS instead
	if (['sender', 'type', 'data'].some((field) => !message.hasOwnProperty(field))) {
		wsClient.send(JSON.stringify({
			type: 'error',
			data: 'Message doesnt contain "type" and "data" fields'
		}))
		return wsClient.close()
	}

	// TODO: Continue from here
	let handlers = {
		room: () => roomController(),
		game: () => gameController(),
	}
	handlers.hasOwnProperty(message.type) && handlers[message.type]()
}

module.exports = routeIncomingMessage
