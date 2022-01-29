/**
 * Copies the text into the users clipboard
 * @param text The text to be copied
 * @returns `true` if the operation was successful, else returns `false`
 */
export async function copy(text: string): Promise<boolean> {
  if ('clipboard' in navigator) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
  const textArea = document.createElement('textarea');
  textArea.style.display = 'none';
  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.focus();
  textArea.select();

  const successful = document.execCommand('copy');

  document.body.removeChild(textArea);

  return successful;
}
