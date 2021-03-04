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
