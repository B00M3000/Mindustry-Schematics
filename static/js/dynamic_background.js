const html = document.documentElement;

async function updateBackground() {
  html.classList.add('active_background');
  const current = html.style.getPropertyValue('--current-image');
  if (current) html.style.setProperty('--previous-image', current);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const background =
    backgrounds[Math.floor(Math.random() * backgrounds.length)];
  html.style.setProperty('--current-image', `url(${background}`);
}

updateBackground();

setInterval(updateBackground, 6000);
