const { Router } = require("express")

const router = Router()

module.exports = router

router.get('/', (req, res) => {
  res.render('next/index.pug')
})