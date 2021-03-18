const currentTags = []
const ul = document.querySelector('ul.tags')
/**@type {HTMLInputElement} */
const input = document.querySelector('input#tags')

if (input && ul) {

  input.addEventListener('keydown', (e) => {
    if (e.key == "Enter") {
      e.preventDefault()
      console.log("tag")
      const { value } = input
      const tag = tags.find(t => t.name.toLowerCase() == value.toLowerCase())
      console.log(tag)
      if (tag && !currentTags.includes(tag)) {
        console.log('work')
        const li = document.createElement('li')
        li.style = `--color: ${tag.color};`
        const layer = document.createElement('div')
        layer.classList.add('layer')
        layer.innerText = input.value
        const xMark = document.createElement('span')
        xMark.innerText = '\u2716'
        xMark.addEventListener('click', () => {
          ul.removeChild(li)
          currentTags.pop(currentTags.indexOf(tag.name))
        })
        layer.appendChild(xMark)
        li.appendChild(layer)
        ul.appendChild(li)
        currentTags.push(tag.name)
      } 
      input.value = ''
    }
  })

}
