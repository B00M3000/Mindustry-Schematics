const { Router } = require('express')
var router = Router()

router.get('/', (req, res) => {
  res.render('schematics', {        schematics: require('../schematics.json')
  })
})

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const schematics = require('../schematics.json')
  const schematic = schematics.find(s => s.id == id)

  res.render('schematic', {
    schematic
  })
})

module.exports = router