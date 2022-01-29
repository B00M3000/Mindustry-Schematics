export function escapeHtmlString(string: string): string {
  return string.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
export function escapeRegexString(string: string): string {
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}
