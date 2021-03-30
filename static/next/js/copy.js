const sleep = async (delay) =>
  await new Promise((resolve) => setTimeout(resolve, delay));

const copy_popup = document.getElementById('copy_popup');

async function copy(text) {
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

  if (successful) {
    const div = document.createElement('div');
    div.id = 'copied_popup';
    const icon = document.createElement('img');
    icon.src = '/assets/paste.svg';

    const text = document.createElement('p');
    text.innerText = 'Copied to Clipboard!';

    div.appendChild(icon);
    div.appendChild(text);
    document.body.appendChild(div);

    await sleep(3000);

    document.body.removeChild(div);
  }
}
