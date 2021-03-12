const mongoose = require('mongoose')

const schematicChangeSchema = mongoose.Schema({
  Changed: {
    type: Object
  },
  
  Description: String,
  
  Delete: String,

  version: { type: String, required: true, default: "v2" }
})

module.exports = mongoose.model('SchematicChanges', schematicChangeSchema)