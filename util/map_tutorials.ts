import { Converter } from 'showdown';
import fs from 'fs';
import path from 'path';
import { rootDir } from './root_dir';

const converter = new Converter();
export class Tutorial {
  constructor(path: string) {
    this.path = path;
  }

  readonly path: string;

  get text(): string {
    return fs.readFileSync(this.path, 'utf-8');
  }

  get title(): string {
    const searchRegex = /^#[^#\n\r][^\n\r]+$/m;
    return searchRegex.exec(this.text)?.[0].replace('#', '') ?? '';
  }

  get html(): string {
    return converter.makeHtml(this.text);
  }
}
export function mapTutorials(): Map<string, Tutorial> {
  const folder = path.join(rootDir, '/tutorials');
  const result = new Map<string, Tutorial>();
  if (!fs.existsSync(folder)) return result;

  const files = fs.readdirSync(folder);
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const filepath = path.join(folder, file);
    result.set(file, new Tutorial(filepath));
  }
  return result;
}
