const preview = document.getElementById('image_preview')
const schematicInput = document.getElementById("text");
const text = document.getElementById('text')
const name = document.getElementById('name')
const description = document.getElementById('description')
const image_preview = document.getElementById('image_preview')
const tagsInput = document.getElementById('tags')
const form = document.querySelector('form')
const submitButton = document.querySelector('button[type=submit]')
let submitting = false

function isValidSchematic(base64Code) {
  try {
    const decoded = atob(base64Code);
    const header = "msch";
    // the startsWith method doesn't work
    for (let i = 0; i < header.length; i++){
      if (header[i] != decoded[i]) return false;
    }
    return true;
  } catch {
    return false;
  }
}

function update_preview() {
  while(preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }

  const file = (upload.files) ? upload.files[0] : undefined;

  if(file){
    const image = document.createElement('img');
    image.src = URL.createObjectURL(file);

    preview.appendChild(image);
  }
}

schematicInput && schematicInput.addEventListener("input", () => {
  const { value } = schematicInput;
  const isValid = isValidSchematic(value);
  if (!isValid) {
    schematicInput.setCustomValidity("This isn't a valid schematic")
    schematicInput.classList.add('invalid')
  } else {
    schematicInput.setCustomValidity('')
    schematicInput.classList.remove('invalid')
  }
})

text && text.addEventListener('change', async () => {
  const value = text.value
  const form = document.querySelector('form')
  form.classList.add('locked')
  if (!isValidSchematic(value)) {
    text.classList.add('invalid')
    return
  }
  const url = `/api/schematics/parse`
  const data = new FormData()
  data.append("text", value.trim())
  const response = await fetch(url, {
    method: 'POST',
    body: data
  })
  switch (response.status) {
    case 200: {
      text.classList.remove('invalid')
      const json = await response.json()
      const imageData = json.image
      name.value = json.name
      description.value = json.description
      let image = image_preview.querySelector("img")
      if (!image) {
        image = document.createElement('img')
        image_preview.appendChild(image)
      }
      image.src = `data:image/png;base64,${imageData}`
      form.classList.remove('locked')
      }
      break
    case 400:
      text.classList.add('invalid')
      break
    case 431:
      alert('The schematic has too much data')
      console.log(value.length)
      break
  }
})

form && form.addEventListener('submit', async (e) => {
  e.preventDefault()
  submitButton.disabled = true
  submitButton.innerHTML = "Please wait..."
  const data = new FormData(form)
  if (!location.href.endsWith('/delete')) {
    data.append('tags', JSON.stringify(currentTags))
  }
  const response = await fetch(form.action, {
    method: 'POST',
    body: data,
  })  
  await sleep(500)
  // redirect the user to the page of the new schematic
  window.location.href = response.url
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
