const mongoose = require('mongoose')

const schematicChangeSchema = mongoose.Schema({
  Original: {
    name: String,
    author: String,
    text: String,
    description: String,
    image: {
      Data: Buffer,
      ContentType: String,
    }
  },
  Changed: {
    name: String,
    author: String,
    text: String,
    description: String,
    image: {
      Data: Buffer,
      ContentType: String,
    }
  },
  
  Description: String,
  
  Delete: String,
  
  id: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('SchematicChanges', schematicChangeSchema)