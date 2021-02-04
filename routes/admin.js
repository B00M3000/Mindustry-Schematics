const { Router } = require('express')
var router = Router()

const secret = "jajaja"

router.use((req, res, next) => {
  const { originalUrl } = req
  
  if(originalUrl == "/admin/" + secret){
    res.cookie('secret', secret, { maxAge: 3600000}) //1 hour
    return res.redirect('/admin')
  }
  
  const s = req.cookies['secret']
  
  if(!s) return res.redirect('/')
  
  next()
})

const schematicChangeSchema = require('../schemas/SchematicChange.js')

router.get('/', (req, res) => {
  res.render('admin')
})

router.get('/schematic_changes', async (req, res) => {
  const changes = await schematicChangeSchema.find({})
  res.render('schematic_changes', {
    changes
  })
})

router.get('/schematic_changes/:_id', async (req, res) => {
  const { _id } = req.params
  
  const change = await schematicChangeSchema.findOne({ _id })
  
  res.render('schematic_change', {
    change
  })
})

module.exports = router