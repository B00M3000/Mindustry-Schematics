const { Router } = require('express')
var router = Router()

const schematicChangeSchema = require('../../schemas/SchematicChange.js')
const schematicSchema = require('../../schemas/Schematic.js')
const avaliableTags = require('../../tags.json')

router.param('_id', async (req, res, next, _id) => {
  const change = await schematicChangeSchema.findOne({ _id })
  
  if(!change) return res.redirect('/admin/schematic_changes')
  
  req.change = change
  
  next()
})

router.get('/', async (req, res) => {
  var changes = await schematicChangeSchema.find({})
  for(var i = 0; i < changes.length; i++){
    changes[i].Original = await schematicSchema.findOne({ _id: changes[i].id })
  }
  res.render('schematic_changes', {
    changes
  })
})

router.get('/:_id', async (req, res) => {
  const { change } = req
  change.Original = await schematicSchema.findOne({ _id: change.id })
  const originalTags = change.Original?.tags.map(name => avaliableTags.find(t => t.name == name))
  const changedTags = change.Changed?.tags.map(name => avaliableTags.find(t => t.name == name))
  res.render('schematic_change', {
    change,
    originalTags,
    changedTags,
  })
})

router.get('/:_id/accept', async (req, res) => {
  const { change } = req
  
  if(change.Delete){
    await schematicSchema.deleteOne({
      _id: change.id
    })
    await schematicChangeSchema.deleteMany({
      id: change.id
    })
  } else {
    await schematicSchema.updateOne({
      _id: change.id
    }, change.Changed)
    await schematicChangeSchema.deleteOne({
      _id: change._id
    })
  }
  
  res.redirect('/admin/schematic_changes')
})

router.get('/:_id/decline', async (req, res) => {
  const { change } = req
  
  await schematicChangeSchema.deleteOne({
    _id: change._id
  })
  
  res.redirect('/admin/schematic_changes')
})

module.exports = router