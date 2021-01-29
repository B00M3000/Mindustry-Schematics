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

let generateColoredHTML = Input => {
  let HTML = '', OPEN;
  while (Input) {
    if (Input.charAt(0) == '[') {
      HTML += `${OPEN ?'</span>':''}<span style="color:${Input.slice(1, Input.indexOf(']'))}">`;
      OPEN = true;
      Input = Input.slice(Input.indexOf(']')+1);
      continue;
    }
    HTML += Input.charAt(0);
    Input = Input.slice(1);
  }
  if (OPEN) HTML += '</span>';
  return HTML;
}