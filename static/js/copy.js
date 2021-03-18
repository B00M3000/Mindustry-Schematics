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
    const content = document.createElement('div')
    var icon = document.createElement('img')
    icon.src = "/assets/paste.png"

    var text = document.createElement('p')
    text.innerText = "Copied to Clipboard!"

    content.appendChild(icon)
    content.appendChild(text)
    div.appendChild(content)
    document.body.appendChild(div)

    await sleep(5000)

    document.body.removeChild(div);
  }
}