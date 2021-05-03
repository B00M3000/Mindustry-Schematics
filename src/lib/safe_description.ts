export function safeDescription(description: string) {
  return description.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
}
