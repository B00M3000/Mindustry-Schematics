const userForms = document.getElementsByClassName('users');
for (uf of userForms) {
  uf.addEventListener('submit', async (e) => {
    e.preventDefault();
    // e.stopPropogation();
    const data = new FormData(uf);
    await fetch(uf.action, {
      method: uf.method,
      body: data,
    });
  });
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
