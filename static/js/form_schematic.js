const upload = document.getElementById('image')
const preview = document.getElementById('image_preview')

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

if(upload && preview){

  upload.addEventListener('change', update_preview);

  window.addEventListener('paste', e => {
    console.log(e.clipboardData.files)
    upload.files = e.clipboardData.files;
    update_preview()
  });
}