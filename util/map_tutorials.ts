import fs from 'fs';
import path from 'path';
import { rootDir } from './root_dir';
export class Tutorial {
  constructor(text: string) {
    this.text = text;
  }

  readonly text: string;

  get title() {
    const searchRegex = /^#[^#\n\r]*$/m;
    return searchRegex.exec(this.text)?.[0];
  }
}
export function mapTutorials(): Map<string, Tutorial> {
  const folder = path.join(rootDir, '/tutorials');
  const files = fs.readdirSync(folder);
  const result = new Map<string, Tutorial>();
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const filepath = path.join(folder, file);
    const text = fs.readFileSync(filepath, 'utf-8');
    result.set(file, new Tutorial(text));
  }
  return result;
}
