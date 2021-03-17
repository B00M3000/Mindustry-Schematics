const mongoose = require('mongoose')

const user = "user"
const password = process.env.MONGO_PASS
const database = "Schematics"

const mongoPath = `mongodb://${user}:${password}@cluster0-shard-00-00.nre6i.mongodb.net:27017,cluster0-shard-00-01.nre6i.mongodb.net:27017,cluster0-shard-00-02.nre6i.mongodb.net:27017/${database}?ssl=true&replicaSet=atlas-12ekcb-shard-0&authSource=admin&retryWrites=true&w=majority`

module.exports = async () => {
  await mongoose.connect(mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true
  })

  return mongoose
}
