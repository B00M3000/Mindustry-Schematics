function keyUp() {
  var input = document.getElementById('schematics_search');
  var results = document.getElementById("schematics_result");
  var divs = results.getElementsByClassName("schematic")
  var names = results.getElementsByClassName("name")

  var query = input.value.toUpperCase()

  for (var i = 0; i < names.length; i++) {
    var nameElement = names[i].getElementsByTagName('h2')[0];
    var name = nameElement.innerText.toUpperCase();
    if (name.includes(query)) {
      divs[i].style.display = "block";
    } else {
      divs[i].style.display = "none";
    }
  }
}