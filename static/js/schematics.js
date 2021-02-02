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

  // div#copy_popup
  //   img(src="assets/paste.png")
  //   p Copied to Clipboard!

function keyUp() {
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('schematics_search');
  filter = input.value.toUpperCase();
  ul = document.getElementById("schematics_result");
  divs = ul.getElementsByTagName('div');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < divs.length; i++) {
    a = divs[i].getElementsByTagName("h2")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      divs[i].style.display = "block";
    } else {
      divs[i].style.display = "none";
    }
  }
}