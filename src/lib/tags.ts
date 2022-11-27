const registry = new Map<string, Tag>();

export class Tag {
  constructor(public readonly name: string, public readonly color: string) {
    registry.set(name.toLowerCase(), this);
  }

  static from(name: string): Tag | undefined {
    return registry.get(name.toLowerCase());
  }

  static parse(names: string[]): Tag[] {
    return names
      .map((name) => Tag.from(name.toLowerCase()))
      .filter((tag) => tag) as Tag[];
  }

  static isValid(value: Tag): boolean {
    return registry.has(value.name.toLowerCase());
  }
}

const Tags = [
  new Tag('Power', '#f6d147'),
  new Tag('Units', '#4cb066'),
  new Tag('Logic', '#8a28ad'),
  new Tag('Art', '#a854c7'),
  new Tag('Defense', '#ba7956'),
  new Tag('Copper', '#d99d73'),
  new Tag('Lead', '#8c7fa9'),
  new Tag('Metaglass', '#ebeef5'),
  new Tag('Graphite', '#b2c6d2'),
  new Tag('Sand', '#f7cba4'),
  new Tag('Coal', '#272727'),
  new Tag('Titanium', '#8da1e3'),
  new Tag('Thorium', '#f7cba4'),
  new Tag('Scrap', '#777777'),
  new Tag('Silicon', '#53565c'),
  new Tag('Plastanium', '#cbd97f'),
  new Tag('Phase Fabric', '#f4ba6e'),
  new Tag('Surge Alloy', '#f3e979'),
  new Tag('Spore Pod', '#7457ce'),
  new Tag('Blast Compound', '#ff795e'),
  new Tag('Pyratite', '#ffaa5f'),
  new Tag('Liquid', '#4ff0C8'),
  new Tag('Stackable', '#429645'),
  new Tag('From Scrap', '#777777'),
  new Tag('On Sand', '#f7cba4'),
  new Tag('On Dark Sand', '#4d3d30'),
  new Tag('On Ice', '#7eded7'),
  new Tag('Core Design', '#e6bc53'),
  new Tag('Thorium Reactor', '#7d4ebf'),
  new Tag('Impact Reactor', '#ff0000'),
  new Tag('Steam Generator', '#8b8f83'),
  new Tag('T5', '#545453'),
  new Tag('T4', '#545453'),
  new Tag('T3', '#545453'),
  new Tag('T2', '#545453'),
  new Tag('T1', '#545453'),
  new Tag('Cyrofluid', '#34d5eb'),
  new Tag('From Sand', '#f7cba4'),
  new Tag('Offence', '#fc6b03'),
  new Tag('Combustion Generator', '#403939'),
  new Tag('RTG Generator', '#7422a3'),
  new Tag('Thermal Generator', '#e86e35'),
  new Tag('Unit Control', '#8a37a6'),
  new Tag('Water', '#3937a6'),
  new Tag('Mining', '#8a37a6'),
  new Tag('Drills', '#7a6a66'),
];
export default Tags;
