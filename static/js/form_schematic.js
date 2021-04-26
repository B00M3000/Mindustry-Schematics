const schematicInput = document.getElementById('text');
const text = document.getElementById('text');
const name = document.getElementById('name');
const description = document.getElementById('description');
const imagePreview = document.getElementById('image_preview');
const form = document.querySelector('form');
const submitButton = document.querySelector('button[type=submit]');
const mainContent = document.getElementById('main-content');
const schematicGenerate = document.getElementById('schematic-generate');
const errorSpan = document.querySelector('span.error');
const modeDiv = document.querySelector('div.mode');
const fileInput = document.getElementById('file');
function isValidSchematic(base64Code) {
  try {
    const decoded = atob(base64Code);
    const header = 'msch';
    // the startsWith method doesn't work
    for (let i = 0; i < header.length; i++) {
      // eslint-disable-next-line eqeqeq
      if (header[i] != decoded[i]) return false;
    }
    return true;
  } catch {
    return false;
  }
}

schematicInput &&
  schematicInput.addEventListener('input', () => {
    const { value } = schematicInput;
    const isValid = isValidSchematic(value);
    if (!isValid) {
      schematicInput.setCustomValidity("This isn't a valid schematic");
      schematicInput.classList.add('invalid');
    } else {
      schematicInput.setCustomValidity('');
      schematicInput.classList.remove('invalid');
    }
  });

text &&
  text.addEventListener('change', async (e) => {
    // reset the file input when the user changes the text input
    if (e.isTrusted && fileInput) fileInput.value = '';
    const value = text.value;
    const form = document.querySelector('form');
    form.classList.add('locked');
    if (!isValidSchematic(value)) {
      text.classList.add('invalid');
      errorSpan.innerText = "This isn't a valid schematic";
      return;
    }
    document.body.classList.remove('parsed');
    document.body.classList.add('parsing');

    const url = `/api/schematics/parse`;
    const data = new FormData();
    data.append('text', value.trim());
    const response = await fetch(url, {
      method: 'POST',
      body: data,
    });

    document.body.classList.add('parsed');
    document.body.classList.remove('parsing');
    switch (response.status) {
      case 200:
        {
          errorSpan.innerHTML = '';
          text.classList.remove('invalid');
          const json = await response.json();
          const imageData = json.image;
          name.value = json.name;
          description.value = json.description;
          let image = imagePreview.querySelector('img');
          if (!image) {
            image = document.createElement('img');
            imagePreview.appendChild(image);
          }
          image.src = `data:image/png;base64,${imageData}`;
          form.classList.remove('locked');
        }
        break;
      case 400: {
        text.classList.add('invalid');
        const data = (await response.json()) || {};
        const { error } = data;
        errorSpan.innerText = error.message || "This isn't a valid schematic";
        break;
      }
      case 500:
        text.classList.add('invalid');
        errorSpan.innerHTML = 'Parsing error, try again later';
        break;
      case 431:
        alert('The schematic has too much data');
        console.log(value.length);
        break;
    }
  });

if (modeDiv) {
  for (const child of modeDiv.children) {
    child.addEventListener('click', (e) => {
      form.dataset.mode = child.value;
    });
  }
}
// this is a "bind" to the text input
// when the user selects a file, it will be read and converted to base64
// which then is passed to the text input
fileInput &&
  fileInput.addEventListener('input', (e) => {
    /**@type {FileList} */
    const files = e.target.files;
    const setText = (value) => {
      text.value = value;
      const event = new Event('change');
      text.dispatchEvent(event);
    };
    if (!files[0]) return setText('');
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      setText(btoa(event.target.result));
    });
    reader.readAsBinaryString(files[0]);
  });
form &&
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitButton.disabled = true;
    submitButton.innerHTML = 'Please wait...';
    const data = new FormData(form);
    data.delete('file');
    if (!location.href.endsWith('/delete')) {
      // eslint-disable-next-line no-undef
      data.append('tags', JSON.stringify(currentTags));
    }
    const response = await fetch(form.action, {
      method: 'POST',
      body: data,
    });
    const url = new URL(response.url);
    // redirect the user to the page of the new schematic
    location.href = url;
  });
