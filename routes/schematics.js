const { Router } = require('express')
var router = Router()

const fs = require('fs')

const schematicSchema = require('../schemas/schematic.js')

router.get('/', async (req, res) => {
  const schematics = await schematicSchema.find({})
  res.render('schematics', {
    schematics
  })
})

router.get('/create', (req, res) => {
  res.render('create_schematic')
})

router.post('/create', async (req, res) => {
  const schematics = await schematicSchema.find({})
  const { name, author, text } = req.body

  const newSchematic = {
    name,
    author,
    text,
  }

  do {
    newSchematic.id = uuid()
  } while(schematics.find(s => s.id == newSchematic.id))

  console.log(newSchematic)

  await new schematicSchema(newSchematic).save()

  res.redirect("/schematics")
})

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const schematic = await schematicSchema.findOne({
    id
  })

  if(!schematic) return res.redirect('/schematics')

  res.render('schematic', {
    schematic
  })
})

module.exports = router

let uuid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}