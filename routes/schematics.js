const { Router } = require('express')
var router = Router()

const schematicSchema = require('../schemas/Schematic.js')
const schematicChangeSchema = require('../schemas/SchematicChange.js')

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
  const { name, author, text, description } = req.body
  const { data, mimetype } = req.files.image

  const newSchematic = {
    name,
    author,
    text,
    description,
    image: {
      Data: data,
      ContentType: mimetype
    }
  }

  do {
    newSchematic.id = uuid()
  } while(schematics.find(s => s.id == newSchematic.id))

  await new schematicSchema(newSchematic).save()

  res.redirect("/schematics")
})

router.param('id', async (req, res, next, id) => {
  const schematic = await schematicSchema.findOne({ id })
  
  if(!schematic) return res.redirect('/schematics')
  
  req.schematic = schematic
  
  next()
})

router.get('/:id/image', async (req, res) => {
  const { schematic } = req

  res.type('Content-Type', schematic.image.ContentType)
  res.send(schematic.image.Data)
})

router.get('/:id', async (req, res) => {
  const { schematic } = req
  res.redirect(`/schematics/${schematic.id}/info`)
})

router.use('/:id/info', async (req, res) => {
  const { schematic } = req

  res.render('schematic_info', {
    schematic
  })
})

router.get('/:id/edit', async (req, res) => {
  const { schematic } = req
  
  res.render('edit_schematic', {
    schematic
  })
})

router.post('/:id/edit', async (req, res) => {
  const { schematic } = req
  const { id } = schematic
  schematic.id = undefined;
  
  const { name, author, text, description, cDescription } = req.body
  const { data, mimetype } = req.files.image
  
  const schematicChange = {
    Original: schematic,
    Changed: {
      name,
      author,
      text,
      description,
      image: {
        Data: data,
        ContentType: mimetype
      }
    },
    Description: cDescription,
    id
  }

  await new schematicChangeSchema(schematicChange).save()

  res.redirect("/schematics")
})

router.get('/:id/delete', async (req, res) => {
  const { schematic } = req
  
  res.render('delete_schematic', {
    schematic
  })
})

router.post('/:id/delete', async (req, res) => {
  const { schematic } = req
  const { reason } = req.body
  const { id } = schematic
  schematic.id = undefined;
  
  const schematicChange = {
    Original: schematic,
    Delete: reason,
    id
  }
  
  await new schematicChangeSchema(schematicChange).save()
  
  res.redirect('/schematics')
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