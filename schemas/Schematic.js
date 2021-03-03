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
  },
  views: {
    type: Number,
    required: true,
    default: 0
  }
})

module.exports = mongoose.model('Schematics', schematicSchema)