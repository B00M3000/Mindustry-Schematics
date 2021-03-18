const mongoose = require('mongoose')

const schematicChangeSchema = mongoose.Schema({
  Changed: {
    type: Object
  },
  
  Description: String,
  
  Delete: String,
})

module.exports = mongoose.model('SchematicChanges', schematicChangeSchema)