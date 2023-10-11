/*
	Here the server is started and the entry points of requests
	are configured:
	- HTTP to send the React application
	- WebSocket for establishing a connection and further messaging

	Messages that coming in via WS protocol are of the 'Buffer' type,
	so here they are also converted to JSON (if possible) for passing to handlers
*/

const express = require('express')
const expressApp = express()
const httpServer = require('http').createServer(expressApp)

const WebSocket = require('ws')
const webSocketServer = new WebSocket.Server({ server: httpServer })

const messageRouter = require('./messageRouter.js')

webSocketServer.on('connection', (webSocketClient) => {
	webSocketClient.on('message', (data, isBinary) => {
		let message = data.toString()
		try {
			message = JSON.parse(message)
		} catch (error) {
			webSocketClient.send(JSON.stringify({
				type: 'error',
				data: 'The message is not in JSON format'
			}))
			return webSocketClient.close()
		}
		messageRouter(webSocketServer, webSocketClient, message)
	})
})

expressApp.get('*', (req, res) => res.send('App'))
httpServer.listen(8080, () => console.log('Listening on localhost:8080'))
