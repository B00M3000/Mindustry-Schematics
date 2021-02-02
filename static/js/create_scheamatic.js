const input = document.getElementById('image');
const preview = document.getElementById('image_preview')

image.addEventListener('change', function () {
  while(preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }

  const file = (input.files) ? input.files[0] : undefined;

  if(file){
    const image = document.createElement('img');
    image.src = URL.createObjectURL(file);

    preview.appendChild(image);
  }
});