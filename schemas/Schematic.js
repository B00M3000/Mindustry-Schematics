const mongoose = require('mongoose')

const schematicSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  image: {
    Data: Buffer,
    ContentType: String,
  },
  description: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true,
    unique: true
  }
})

module.exports = mongoose.model('Schematics', schematicSchema)