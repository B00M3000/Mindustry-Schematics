var tagsInputDiv = document.querySelector('.tags-input');
var currentTags = []

if(tagsInputDiv){
  tagsInputDiv._list = tagsInputDiv.querySelector('ul');
  tagsInputDiv._input = tagsInputDiv.querySelector('input');
  tagsInputDiv._input._icategories = tagsInputDiv;
  tagsInputDiv.onkeydown = function(e){
    var e = event || e;
    if(e.keyCode == 13) {
      e.preventDefault();
      
      var c = e.target._icategories;
      var value = c._input.value;
      var tag = tags.find(t => t.name.toUpperCase() == value.toUpperCase())
      if(tag && currentTags.indexOf(tag.name) === -1){
        var li = document.createElement('li');
        li.innerHTML = tag.name;
        li.style.background = tag.color;
        var x_mark = document.createElement('img');
        x_mark.src = "/assets/x_mark.png"
        x_mark.style.height = "10px"
        x_mark.style.width = "13px"
        li.appendChild(x_mark)
        c._list.appendChild(li);
        c._input.value = '';

        currentTags.push(tag.name)

        x_mark.onclick = (e) => {
          tagsInputDiv._list.removeChild(li)
          currentTags.pop(currentTags.indexOf(tag.name))
        }
      } else {
        c._input.value = '';
      }
    }
  }
}
