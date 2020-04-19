fetch('api/wedding-list')
  .then((response) => {
    return response.json();
  })
  .then((items) => {
    refresh_items(items)
  });

categories = new Set()
function refresh_items(items, category='') {
  if ('content' in document.createElement('template')) {
    let template = document.querySelector('#item');
    let ul = document.querySelector("#items");
    for (let item in items) {
      if (category == '' || items[item].category == category) {
        let li = template.content.cloneNode(true);
        li.querySelector(".text-body").textContent = item;
        li.querySelector(".text-muted").textContent = `${items[item].price / 100} €`;
        ul.appendChild(li);
      }
      let cat = items[item].category;
      if (cat != "") {
        categories.add(cat)
      }
    }
  } else {
    alert('Votre navigateur est trop ancien pour afficher ce site, veuillez le mettre à jour.')
  }
}