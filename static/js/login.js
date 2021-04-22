const userForms = document.getElementsByClassName('users');
for (uf of userForms) {
  addSubmitListener(uf)
}

function addSubmitListener(form){
  uf.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    await fetch(form.action, {
      method: form.method,
      body: data,
    });
  });
}

async function deleteToken(token){
  const form = document.getElementById(`form-${token}`)
  if(form){
    form.remove()
    await fetch(form.action, {
      method: "DELETE",
    })
  }
}

function regenerateToken(token) {
  const tokenInput = document.getElementById(token);
  tokenInput.value = generateId();
}

function generateId() {
  const preffix = new Date().getTime().toString(36);
  const suffix = Math.floor(Math.random() * 100000).toString(36);
  return preffix + suffix;
}
