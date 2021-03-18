require('tslib')

const { Router } = require('express')
var router = Router()

const { Schematic } = require('mindustry-schematic-parser')
const {Types: { ObjectId } } = require('mongoose')

const tags = require('../tags.json')

const schematicSchema = require('../schemas/Schematic.js')
const schematicChangeSchema = require('../schemas/SchematicChange.js')

const limitPerPage = 20

router.get('/', async (req, res) => {
  var { query, page } = req.query
  
  var schematics;
  var documents;
  
  if(!page || isNaN(page) || page < 1 || page % 1 != 0) page = 1
  else page = parseInt(page)
  
  const skip = limitPerPage * (page - 1);
  
  if(query){
    const regex = new RegExp(query, "i")
    const _query = { name: regex }
    schematics = await schematicSchema.find(_query, "id name image", { skip, limit: limitPerPage })
    documents = await schematicSchema.countDocuments(_query)
  } else {
    query = ""
    schematics = await schematicSchema.find(null, "id name image", { skip, limit: limitPerPage })
    documents = await schematicSchema.countDocuments()
  }
  
  var pages;
  
  if(documents % limitPerPage == 0) pages = documents/limitPerPage
  else pages = Math.floor(documents/limitPerPage)+1
  
  if(pages == 0) pages = 1
  
  res.render('schematics', {
    skip,
    query,
    page,
    length: schematics.length,
    pages,
    documents,
    schematics
  })
})

router.get('/create', (req, res) => {
  res.render('create_schematic', {
    url: req.url,
    tags,
    _tags: JSON.stringify(tags)
  })
})

router.post('/create', async (req, res) => {
  const schematics = await schematicSchema.find({})
  const { name, author, creator, text, description, tags } = req.body

  const schematic = Schematic.decode(text)
  const {powerBalance, powerConsumption, powerProduction, requirements}=schematic
  const data = await schematic.toImageBuffer()
  const mimetype ="image/png"
  const newSchematic = {
    name,
    creator: creator == undefined ? author : creator,
    text,
    description,
    encoding_version: schematic.version,
    powerBalance,
    powerConsumption,
    powerProduction,
    requirements,
    tags: JSON.parse(tags),
    image: {
      Data: data,
      ContentType: mimetype
    }
  }


  const { id } = (await new schematicSchema(newSchematic).save())

  res.redirect(`/schematics/${id}`)
})

router.param('id', async (req, res, next, id) => {
  const schematic = await schematicSchema.findById(ObjectId(id))
  
  if(!schematic) return res.redirect('/schematics')
  
  req.schematic = schematic
  
  next()
})

router.get('/:id/text', async (req, res) => {
  const { schematic } = req

  const _schematic = Schematic.decode(schematic.text)

  _schematic.name = schematic.name
  _schematic.description = schematic.description

  const text = schematic.decode()

  res.send(text)
})

router.get('/:id', async (req, res) => {
  var { schematic } = req
  
  schematic = await schematicSchema.findOneAndUpdate({ _id: schematic._id}, {
    $inc: {
      views: 1
    }
  }, {
    new: true
  })

  res.render('schematic_info', {
    url: req.url,
    schematic
  })
})

router.get('/:id/image', async (req, res) => {
  const { schematic } = req

  res.type('Content-Type', schematic.image.ContentType)
  res.send(schematic.image.Data)
})

router.get('/:id/edit', async (req, res) => {
  const { schematic } = req
  
  res.render('edit_schematic', {
    schematic
  })
})

router.post('/:id/edit', async (req, res) => {
  const { schematic } = req
  
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
  
  const schematicChange = {
    Original: schematic,
    Delete: reason,
  }
  
  await new schematicChangeSchema(schematicChange).save()
  
  res.redirect('/schematics')
})

module.exports = router
