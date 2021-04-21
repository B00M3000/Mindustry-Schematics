const userForms = document.getElementsByClassName("users")
for(uf of userForms){
  uf.addEventListener('submit', async e => {
    e.preventDefault()
    e.stopPropogation()
    const data = new FormData(uf)
    const response = await fetch(form.action, {
      method: form.method,
      body: data,
    });
    return false
  })
}

function regenerateToken(token){
  var tokenInput = document.getElementById(`input-${token}`)
  tokenInput.value = generateId(16)
}

function generateId(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}