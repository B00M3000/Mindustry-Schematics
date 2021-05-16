import Tags from '../tags.json';
interface Tag {
  name: string;
  color: string;
}
function isStringArray(arr: unknown[]): arr is string[] {
  return typeof arr[0] === 'string';
}
export function parseTags(tags: string[] | Tag[]): Tag[] {
  if (tags.length === 0) return [];
  if (isStringArray(tags)) {
    return tags
      .map((tag) =>
        Tags.find((t) => t.name.toLowerCase() === tag.toLowerCase())
      )
      .filter((tag) => tag) as Tag[];
  }
  return tags
    .map((tag) =>
      Tags.find((t) => t.name.toLowerCase() === tag.name.toLowerCase())
    )
    .filter((tag) => tag) as Tag[];
}
