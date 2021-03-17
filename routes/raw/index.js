const { Router } = require('express')
var router = Router()

router.get('/schematics', require('./schematics'))

module.exports = router