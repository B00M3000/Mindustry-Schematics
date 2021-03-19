const { Router } = require('express')
var router = Router()

const schematicChangeSchema = require('../../schemas/SchematicChange.js')

router.use('/schematics', require('./schematics'))

router.get('/schematic-changes/:_id/image', async (req, res) => {
  const change = await schematicChangeSchema.findOne({ _id: req.params._id })
  
  if(!change) return res.sendStatus(404)
  
  res.type('Content-Type', change.Changed.image.ContentType)
  res.send(change.Changed.image.Data)
})

module.exports = router