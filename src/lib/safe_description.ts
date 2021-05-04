export function safeDescription(description: string): string {
  return description.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
}
