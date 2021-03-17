const text = document.getElementById('text')
const name = document.getElementById('name')
const description = document.getElementById('description')
const image_preview = document.getElementById('image_preview')

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

text && text.addEventListener('change', async () => {
  const value = text.value
  const form = document.querySelector('form')
  form.classList.add('locked')
  if (!isValidSchematic(value)) {
    text.classList.add('invalid')
    return
  }
  const response = await fetch(`/api/schematics/parse?text=${encodeURIComponent(value.trim())}`)
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
  }
})