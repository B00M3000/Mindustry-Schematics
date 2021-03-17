const mongoose = require('mongoose')

const username = process.env.MONGO_USER
const password = process.env.MONGO_PASS
const database = process.env.MONGO_DATABASE_NAME
const path = (process.env.MONGO_PATH).replace('<username>', username).replace('<password>', password).replace('<database>', database)

module.exports = async () => {
  await mongoose.connect(path, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true
  })

  return mongoose
}
