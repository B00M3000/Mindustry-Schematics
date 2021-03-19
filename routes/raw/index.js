const { Router } = require('express')
var router = Router()

const schematicChangeSchema = require('../../schemas/SchematicChange.js')
const { Schematic } = require('mindustry-schematic-parser')

router.use('/schematics', require('./schematics'))

router.get('/schematic-changes/:_id/image', async (req, res) => {
  const change = await schematicChangeSchema.findOne({ _id: req.params._id })
  if (!change) return res.sendStatus(404)

  res.type('image/png')
  res.send(await Schematic.decode(change.Changed.text).toImageBuffer())
})
module.exports = router