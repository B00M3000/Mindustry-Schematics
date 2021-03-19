const mongoose = require('mongoose')

const schematicChangeSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  Changed: {
    type: Object
  },
  
  Description: String,
  
  Delete: String,
})

module.exports = mongoose.model('SchematicChanges', schematicChangeSchema)