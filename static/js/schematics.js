function keyUp() {
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('schematics_search');
  filter = input.value.toUpperCase();
  ul = document.getElementById("schematics_result");
  divs = ul.getElementsByTagName('div');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < divs.length; i++) {
    a = divs[i].getElementsByTagName("h2")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      divs[i].style.display = "block";
    } else {
      divs[i].style.display = "none";
    }
  }
}