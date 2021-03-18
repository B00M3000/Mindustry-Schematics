const text = document.getElementById('text')
const name = document.getElementById('name')
const description = document.getElementById('description')
const image_preview = document.getElementById('image_preview')
const tagsInput = document.getElementById('tags')
const form = document.querySelector('form')
const submitButton = document.querySelector('button[type=submit]')

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
form && form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const data = new URLSearchParams()
  for (const pair of new FormData(form)) {
    data.append(pair[0], pair[1])
  }
  data.append('tags', JSON.stringify(currentTags))
  const response = await fetch(form.action, {
    method: 'POST',
    body: data,
  })
  submitButton.innerHTML = "Please wait..."
  
  sleep(1300)
  // redirect the user to the page of the new schematic
  window.location.href = response.url
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}