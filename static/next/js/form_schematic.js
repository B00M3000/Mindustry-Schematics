const schematicInput = document.getElementById('text');
const text = document.getElementById('text');
const name = document.getElementById('name');
const description = document.getElementById('description');
const imagePreview = document.getElementById('image_preview');
const form = document.querySelector('form');
const submitButton = document.querySelector('button[type=submit]');
const mainContent = document.getElementById('main-content');
const schematicGenerate = document.getElementById('schematic-generate');

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
  text.addEventListener('change', async () => {
    const value = text.value;
    const form = document.querySelector('form');
    form.classList.add('locked');
    if (!isValidSchematic(value)) {
      text.classList.add('invalid');
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
      case 400:
        text.classList.add('invalid');
        break;
      case 431:
        alert('The schematic has too much data');
        console.log(value.length);
        break;
    }
  });

form &&
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitButton.disabled = true;
    submitButton.innerHTML = 'Please wait...';
    const data = new FormData(form);
    if (!location.href.endsWith('/delete')) {
      // eslint-disable-next-line no-undef
      data.append('tags', JSON.stringify(currentTags));
    }
    const response = await fetch(form.action, {
      method: 'POST',
      body: data,
    });
    const url = new URL(response.url);
    url.pathname = `/next${url.pathname}`;
    // redirect the user to the page of the new schematic
    location.href = url;
  });
