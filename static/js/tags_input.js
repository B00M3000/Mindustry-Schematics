const currentTags = []
const ul = document.querySelector('ul.tags')
/**@type {HTMLInputElement} */
const input = document.querySelector('input#tags')

if (input && ul) {
  input.addEventListener('input', (e) => {
    const { value } = input
    e.preventDefault()
    const tag = tags.find(t => t.name.toLowerCase() == value.toLowerCase())
    const isUsed = currentTags.includes(tag) 
    if (tag && !isUsed) {
      const li = document.createElement('li')
      li.style = `--color: ${tag.color};`
      const layer = document.createElement('div')
      layer.classList.add('layer')
      layer.innerText = tag.name
      const xMark = document.createElement('span')
      xMark.innerText = '\u2716'
      xMark.addEventListener('click', () => {
        ul.removeChild(li)
        currentTags.pop(currentTags.indexOf(tag.name))
      })
      layer.appendChild(xMark)
      li.appendChild(layer)
      ul.appendChild(li)
      currentTags.push(tag)
      input.value = ''
    } else if (isUsed) {
      input.value = ''
    }
  })
}
