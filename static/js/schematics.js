// function keyUp() {
//   var input = document.getElementById('schematics_search');
//   var results = document.getElementById("schematics_result");
//   var divs = results.getElementsByClassName("schematic")
//   var names = results.getElementsByClassName("name")

//   var query = input.value.toUpperCase()

//   for (var i = 0; i < names.length; i++) {
//     var nameElement = names[i].getElementsByTagName('h2')[0];
//     var name = nameElement.innerText.toUpperCase();
//     if (name.includes(query)) {
//       divs[i].style.display = "block";
//     } else {
//       divs[i].style.display = "none";
//     }
//   }
// }

// var images = document.getElementsByClassName('schematic_image')

// const IMAGE_WIDTH = 166
// const IMAGE_HEIGHT = 166

// for(image of images){
//   var { width, height } = image
//   var widthS, heightS

//   widthS = IMAGE_WIDTH/width
//   heightS = IMAGE_HEIGHT/height

//   var scale;
//   if(widthS > IMAGE_WIDTH || heightS > IMAGE_HEIGH) scale = Math.max(widthS, heightS)
//   else scale = Math.min(widthS, heightS)

//   image.width *= scale
//   image.height *= scale
// }
const form = document.querySelector("form")
document.addEventListener("DOMContentLoaded", function() {
  const lazyloadImages = document.querySelectorAll("img.lazy");
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src
      img.addEventListener('load', ()=> img.classList.add('loaded'))
      observer.unobserve(img)
    }
    })
  }, {
  })
  lazyloadImages.forEach(function (img) {
    observer.observe(img)
  })
});

form && form.addEventListener("submit", (e) => {
  e.preventDefault()
  const formData = new FormData(form)
  const searchParams = new URLSearchParams()
  for (const pair of formData) {  
    searchParams.append(pair[0], pair[1])
  }
  if (currentTags.length > 0) {
    searchParams.set("tags", currentTags.map(t => t.name).join(' '))
  }
  const url = `${form.action}?${searchParams}`
  window.location.href = url
})