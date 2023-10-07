const express = require('express')
const app = express()
const httpServer = require('http').createServer(app)

const WebSocket = require('ws')
const webSocketServer = new WebSocket.Server({ server: httpServer })

webSocketServer.on('connection', (webSocketClient) => {
	webSocketClient.on('message', (event) => {
		try {
			switch ((event = JSON.parse(event)).type) {
				case 'chat':
					console.log('Handle chat event')
					break;

				default:
					console.log('Wrong event type')
					break;
			}
		} catch (error) {
			console.log('Incoming message is not in JSON format')
			webSocketClient.close()
		}
	})
})

app.get('*', (req, res) => res.send('App'))
httpServer.listen(3000, () => console.log('Lisening on port :3000'))
