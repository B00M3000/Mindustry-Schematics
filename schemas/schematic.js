const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const schematicSchema = mongoose.Schema({
  name: reqString,
  author: reqString,
  text: reqString,
  id: {
    type: String,
    required: true,
    unique: true
  }
})

module.exports = mongoose.model('Schematics', schematicSchema)