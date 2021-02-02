const { Router } = require('express')
var router = Router()

const tutorials = require('../tutorials.json')

router.get('/', (req, res) => {
  res.render('tutorials', {
    tutorials
  })
})

router.get('/:name', (req, res) => {
  const name = req.params.name
  const tutorial = tutorials.find(t => t.name == name)
  
  if(!tutorial) res.redirect('/tutorials')
  
  res.render('tutorial', tutorial)
})

module.exports = router