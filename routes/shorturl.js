const { Router } = require('express')
var router = Router()

router.get('/', (req, res) => {
  res.render('create_shorturl', {
    
  })
})

router.post('/', (req, res) => {
  
})

module.exports = router