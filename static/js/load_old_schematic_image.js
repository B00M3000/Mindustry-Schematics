const oldImageSrc = document.getElementById('image_preview')
const preview = document.getElementById('oldImageSrc')

const image = document.createElement('img');
image.src = URL.createObjectURL(oldImageSrc);

preview.appendChild(image);