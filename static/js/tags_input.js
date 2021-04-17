let currentTags = [];
try {
  currentTags = _currentTags;
} catch {}

const ul = document.querySelector('ul.tags');
/** @type {HTMLInputElement} */
const input = document.querySelector('input#tags');

for (let i = 0; i < currentTags.length; i++) {
  const tag = currentTags[i];
  let currentTag;
  if (tag.name && tag.color) {
    currentTag = tag;
  } else {
    currentTag = tags.find((t) => t.name.toLowerCase() === tag.toLowerCase());
    currentTags[i] = currentTag;
  }
  addTag(currentTag);
}

if (input && ul) {
  input.addEventListener('input', (e) => {
    const { value } = input;
    e.preventDefault();
    const tag = tags.find((t) => t.name.toLowerCase() === value.toLowerCase());
    const isUsed = currentTags.includes(tag);
    if (tag && !isUsed) {
      currentTags.push(tag);
      addTag(tag);
    } else if (isUsed) {
      input.value = '';
    }
  });
}

function addTag(tag) {
  const li = document.createElement('li');
  li.style = `--color: ${tag.color};`;
  const layer = document.createElement('div');
  layer.classList.add('layer');
  layer.innerText = tag.name;
  const xMark = document.createElement('img');
  xMark.src = '/assets/cross-mark.svg';
  xMark.addEventListener('click', () => {
    ul.removeChild(li);
    currentTags.splice(currentTags.indexOf(tag), 1);
  });
  layer.appendChild(xMark);
  li.appendChild(layer);
  ul.appendChild(li);
  input.value = '';
}
