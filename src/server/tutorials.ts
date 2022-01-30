import showdown from 'showdown';
import fs from 'fs';
import path from 'path';

const converter = new showdown.Converter();
export class Tutorial {
  constructor(public readonly path: string) {}

  private _text?: string;
  private _html?: string;
  private _title?: string;

  get text(): string {
    if (this._text === undefined) this._text = fs.readFileSync(this.path, 'utf-8');
    return this._text;
  }

  get title(): string {
    if (this._title === undefined) {
      const searchRegex = /^#[^#\n\r][^\n\r]+$/m;
      this._title = searchRegex.exec(this.text)?.[0].replace('#', '') ?? '';
    }
    return this._title;
  }

  get html(): string {
    if (this._html === undefined) this._html = converter.makeHtml(this.text);
    return this._html;
  }
}
let tutorials: Map<string, Tutorial>;
export function getTutorials(): Map<string, Tutorial> {
  if (tutorials) return tutorials;
  const folder = path.resolve('tutorials');
  tutorials = new Map<string, Tutorial>();
  if (!fs.existsSync(folder)) return tutorials;
  const files = fs.readdirSync(folder);
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const filepath = path.join(folder, file);
    tutorials.set(file, new Tutorial(filepath));
  }
  return tutorials;
}
