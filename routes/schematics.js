require('tslib')

const { Router } = require('express')
var router = Router()

const { Schematic } = require('mindustry-schematic-parser')
const { Types: { ObjectId } } = require('mongoose')

const tags = require('../tags.json')

const schematicSchema = require('../schemas/Schematic.js')
const schematicChangeSchema = require('../schemas/SchematicChange.js')

const limitPerPage = 20

router.get('/', async (req, res) => {
  var { query, page, tags } = req.query

  try {
    if(!page || isNaN(page) || page < 1 || page % 1 != 0) page = 1
    else page = parseInt(page)
    
    const skip = limitPerPage * (page - 1);

    let _query = {};
    if(query) _query = { name: new RegExp(query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "i") }

    let _tags = undefined;
    if(tags) _query.tags = { $all: tags.split("+") }
    
    const schematics = await schematicSchema.find(_query, "id name image text", { skip, limit: limitPerPage })
    const documents = await schematicSchema.countDocuments()
    
    const pages = ((documents % limitPerPage == 0) ? documents/limitPerPage : Math.floor(documents/limitPerPage)+1) || 1

    if(page > pages) return res.redirect(`/schematics?page=${pages}${query ? `&query=${query}` : "" }${tags ? `&tags=${tags}` : "" }` )
    
    res.render('schematics', {
      skip,
      query,
      page,
      length: schematics.length,
      pages,
      documents,
      schematics
    })
  } catch(e) {
    res.status(422).redirect('/schematics')
  }
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

router.get('/:id/edit', async (req, res) => {
  const { schematic } = req
  
  res.render('edit_schematic', {
    schematic,
    tags,
    _tags: JSON.stringify(tags),
    previousTags: JSON.stringify(schematic.tags)
  })
})

router.get('/:id/delete', async (req, res) => {
  const { schematic } = req
  
  res.render('delete_schematic', {
    schematic
  })
})

module.exports = router