const { Schematic } = require('mindustry-schematic-parser')

module.exports = {
  create: (name, desc, text){
    const schematic = Schematic.decode(text)
    schematic.name = name
    schematic.description = desc
    return schematic
  },
  toSchema: (schematic, options){
    return {
      name: schematic.name,
      creator: options.creator,
      description: schematic.description

      image: options.image,
      requirements: schematic.requirements,
      powerProduction: schematic.powerProduction,
      powerConsumption: schematic.powerConsumption,

      text: schematic.encode(),

      views: options.views,
    }
  }
}