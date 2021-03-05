const upload = document.getElementById('image')
const preview = document.getElementById('image_preview')
const schematicInput = document.getElementById("text");

function isValidSchematic(base64Code) {
  try {
    const decoded = atob(base64Code);
    console.log(decoded)
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

schematicInput?.addEventListener("input", () => {
  const { value } = schematicInput;
  const isValid = isValidSchematic(value);
  if (!isValid) {
    schematicInput.setCustomValidity("This isn't a valid schematic")
  }
})

if(upload && preview){

  upload.addEventListener('change', update_preview);

  window.addEventListener('paste', e => {
    if(e.clipboardData.files.length > 0 ) {
      upload.files = e.clipboardData.files;
      update_preview()
    }
  });
}