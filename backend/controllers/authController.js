/*
	This module connects to the database and checks whether the user is authorized
	If the user is not found, his account will be created and authorization is confirmed
*/

const db = require('../database/db')

function isAuth(userId, userToken) {
	return new Promise((resolve, reject) => {
		db.findOne({ userId }, (err, doc) => {
			if (err) { reject(err); return }
			if (!doc) {
				db.insert({ userId, userToken }, (err) => {
					if (err) reject(err)
					resolve(true)
				})
			} else resolve(userToken === doc.userToken)
		})
	})
}

module.exports = { isAuth }
