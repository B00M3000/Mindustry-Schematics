const userForms = document.getElementsByClassName('usersForms');
for (uf of userForms) {
  if(uf.id != "template") addSubmitListener(uf)
}

function addSubmitListener(form){
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    await fetch(form.action, {
      method: form.method,
      body: data,
    });
  });
}

const template = document.getElementById('template')
const users = document.querySelector('.users')
function createToken(){
  const form = template.cloneNode(true)
  const token = generateId()
  form.style.display = ""
  form.id = `form-${token}`
  form.action = `/user/${token}`
  console.log(form)
  form.querySelector('input[name="token"]').id = token
  form.querySelector('input[name="token"]').value = token
  addSubmitListener(form)
  const li = document.createElement('li')
  li.append(form)
  users.append(li)
}

async function deleteToken(form){
  form.remove()
  await fetch(form.action, {
    method: "DELETE",
  })
}

function regenerateToken(form) {
  const token = form.id.replace('form-', '')
  const tokenInput = document.getElementById(token);
  tokenInput.value = generateId();
}

function generateId() {
  const preffix = new Date().getTime().toString(36);
  const suffix = Math.floor(Math.random() * 100000).toString(36);
  return preffix + suffix;
}
