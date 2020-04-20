fetch('api/wedding-list')
  .then((response) => {
    return response.json();
  })
  .then((items) => {
    init_items(items)
  });

function init_items(items) {
  let ul = document.querySelector("#items");
  let categories = new Set(['all'])
  if ('content' in document.createElement('template')) {
    var template = document.querySelector('#item');
  } else {
    alert('Votre navigateur est trop ancien pour afficher cette page, veuillez le mettre à jour.')
  }
  for (let item in items) {
    let li = template.content.cloneNode(true);
    li.querySelector(".text-body").textContent = item;
    li.querySelector(".text-muted").textContent = `${items[item].price / 100} €`;
    ul.appendChild(li);
    let cat = items[item].category;
    if (cat != '') {
      categories.add(cat)
    }
  }
}

function refresh_items(category='all') {
  if (category == 'all' || items[item].category == category) {
  }
}
  