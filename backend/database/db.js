const Datastore = require('nedb')

let db = new Datastore({ filename: 'database/users' })
db.loadDatabase()

module.exports = db
