const onSubmitLoadingScreen = document.getElementById('onSubmitLoadingScreen')
const loadingScreen = document.getElementById('loadingScreen')

onSubmitLoadingScreen.addEventListener("submit", () => {
  for(e of document.body.children){
    e.style.display = "none"
  }
  loadingScreen.style.display = ""
})