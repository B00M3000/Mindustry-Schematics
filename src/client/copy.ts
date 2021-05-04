/**
 * Copies the text into the users clipboard
 * @param text The text to be copied
 * @returns `true` if the operation was successful, else returns `false`
 */
export function copy(text: string): boolean {
  const textArea = document.createElement('textarea');
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);

  textArea.focus();
  textArea.select();

  const successful = document.execCommand('copy');

  document.body.removeChild(textArea);

  return successful;
}
