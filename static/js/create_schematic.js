const text = document.getElementById('text')
const name = document.getElementById('name')
const description = document.getElementById('description')
const image_preview = document.getElementById('image_preview')

text.onchange = () => {
  image_preview.src = `/api/schematics/image?text=${text.value}`
  fetch("/api/schematics/parse?return=name%20description")
    .then(function (myJson) {
      const json = response.json();
      name.value = json.name
      description.value = json.description
    })
  
}

fetch("https://ipinfo.io/json")
  .then(function (response) {
    return response.json();
  })
  .then(function (myJson) {
    console.log(myJson.ip);
  })
  .catch(function (error) {
    console.log("Error: " + error);
  });