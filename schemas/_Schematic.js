const mongoose = require('mongoose')

const _schematicSchema = mongoose.Schema({
  name: { type: String, required: true },
  creator: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: Array, required: true, default: [] }, 

  image: { Data: Buffer, ContentType: String },
  requirements: { type: Object, required: true },
  powerProduction: { type: Number, required: true },
  powerConsumption: { type: Number, required: true },

  text: { type: String, required: true },

  views: { type: Number, required: true, default: 0 },
})

module.exports = mongoose.model('_Schematics', _schematicSchema)