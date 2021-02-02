const sleep = async (delay) => await new Promise(resolve => setTimeout(resolve, delay));

var copy_popup = document.getElementById('copy_popup')

async function copy(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  
  textArea.focus();
  textArea.select();

  var successful = document.execCommand('copy');

  document.body.removeChild(textArea);

  if(successful) {
    var div = document.createElement('div')
    div.id = "copied_popup"

    var icon = document.createElement('img')
    icon.src = "assets/paste.png"

    var text = document.createElement('p')
    text.innerText = "Copied to Clipboard!"

    div.appendChild(icon)
    div.appendChild(text)
    document.body.appendChild(div)

    await sleep(5000)

    document.body.removeChild(div);
  }
}

function keyUp() {
  var input = document.getElementById('schematics_search');
  var results = document.getElementById("schematics_result");
  var divs = results.getElementsByClassName("schematic")
  var names = results.getElementsByClassName("name")

  var query = input.value.toUpperCase()

  for (var i = 0; i < names.length; i++) {
    console.log(i, names)
    var nameElement = names[i].getElementsByTagName('h2')[0];
    var name = nameElement.innerText.toUpperCase();
    if (name.includes(query)) {
      divs[i].style.display = "block";
    } else {
      divs[i].style.display = "none";
    }
  }
}