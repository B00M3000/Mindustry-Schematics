const { Router } = require('express')
var router = Router()

const schematicChangeSchema = require('../../schemas/SchematicChange.js')
const schematicSchema = require('../../schemas/Schematic.js')

router.param('_id', async (req, res, next, _id) => {
  const change = await schematicChangeSchema.findOne({ _id })
  
  if(!change) return res.redirect('/admin/schematic_changes')
  
  req.change = change
  
  next()
})

router.get('/', async (req, res) => {
  const changes = await schematicChangeSchema.find({})
  res.render('schematic_changes', {
    changes
  })
})

router.get('/:_id', async (req, res) => {
  const { change } = req
  
  res.render('schematic_change', {
    change
  })
})

router.get('/:_id/accept', async (req, res) => {
  const { change } = req
  
  if(change.Delete){
    await schematicSchema.deleteOne({
      id: change.id
    })
  } else {
    await schematicSchema.updateOne({
      id: change.id
    }, change.Changed)
  }

  await schematicChangeSchema.deleteOne({
    _id: change._id
  })
  
  res.redirect('/admin/schematic_changes')
})

router.get('/:_id/decline', async (req, res) => {
  const { change } = req
  
  await schematicChangeSchema.deleteOne({
    _id: change._id
  })
  
  res.redirect('/admin/schematic_changes')
})

router.get('/:_id/image/Changed', async (req, res) => {
  const { change } = req
  
  res.type('Content-Type', change.Changed.image.ContentType)
  res.send(change.Changed.image.Data)
})

module.exports = router