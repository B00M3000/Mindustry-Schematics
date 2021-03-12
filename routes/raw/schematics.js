router.param('id', async (req, res, next, id) => {
  const schematic = await schematicSchema.findOne({ id })
  
  if(!schematic) return res.redirect('/schematics')
  
  req.schematic = schematic
  
  next()
})

router.get('/:id/image', async (req, res) => {
  const { schematic } = req

  res.type('Content-Type', schematic.image.ContentType)
  res.send(schematic.image.Data)
})