const { Router } = require('express')
var router = Router()

router.get('/', (req, res) => {
  res.sendStatus(404)
})

router.get('/search', (req, res) => {
  const { query } = req.query;
  const schematics = require('../schematics.json')
  const filtered_schematic = schematics.filter(s => s.name.includes(query))

  res.send({
    schematics: filtered_schematic
  })
})

router.get('/get', (req, res) => {
  const { id } = req.query;
  const schematics = require('../schematics.json')
  const schematic = schematics.find(s => s.id == id)

  res.send({
    schematic
  })
})

module.exports = router