const { Router } = require('express')
var router = Router()

const { Schematic } = require('mindustry-schematic-parser')

const schematicSchema = require('../../schemas/Schematic.js')

const limitPerPage = 20

router.get('/', async (req, res) => {
  var { query, page } = req.query
  
  var schematics;
  
  if(!page || isNaN(page) || page < 1 || page % 1 != 0) page = 1
  else page = parseInt(page)
  
  const skip = limitPerPage * (page - 1);
  
  if(query){
    const regex = new RegExp(query, "i")
    const _query = { name: regex }
    schematics = await schematicSchema.find(_query, null, { skip, limit: limitPerPage })
    documents = await schematicSchema.countDocuments(_query)
  } else {
    query = ""
    schematics = await schematicSchema.find(null, null, { skip, limit: limitPerPage })
  }
})

router.get('/image', async (req, res) => {
  
})

router.get('/parse', async (req, res) => {
  const { text } = req.query
  const schematic = Schematic.decode(text)

  res.send({
    name: schematic.name,
    description: schematic.description,
    powerProduction: schematic.powerProduction,
    powerConsumption: schematic.powerConsumption,
    requirements: schematic.requirements,
    image: await schematic.toImageBuffer()
  })
})

router.post('/create', async (req, res) => {
  const schematics = await schematicSchema.find({})
  const { name, author, text, description } = req.body
  const { data, mimetype } = req.files.image

  var schematic = new schematicSchema({
    
  })

  schematic = await new schematicSchema(schematic).save()

  if(!schematic) return res.redirect(`/schematics/create?success=false`)
  else res.redirect(`/schematics/create?success=true&id=${schematic._id}`)
})

router.get('/image', async (req, res) => {

})

module.exports = router