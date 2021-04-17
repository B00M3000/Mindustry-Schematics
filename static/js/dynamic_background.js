const html = document.documentElement

function updateBackground(){
  const background = backgrounds[Math.floor((Math.random() * backgrounds.length))];
  html.style.setProperty('--background', `url(${background})`)
}

updateBackground()

setInterval(updateBackground, 6000)