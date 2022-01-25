import type { Tag } from '@/interfaces/tag';
import Tags from '@/lib/tags';
export function parseTags(names: string[]): Tag[] {
  return names
    .map((name) => Tags.find((tag) => tag.name.toLowerCase() == name.toLowerCase()))
    .filter((tag) => tag) as Tag[];
}
