const mongoose = require('mongoose')

const _schematicChangeSchema = mongoose.Schema({
  Changed: {
    type: Object
  },
  
  Description: String,
  
  Delete: String,
})

module.exports = mongoose.model('_SchematicChanges', _schematicChangeSchema)