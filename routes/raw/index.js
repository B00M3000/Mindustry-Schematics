const { Router } = require('express')
var router = Router()

router.use('/schematics', require('./schematics'))

module.exports = router