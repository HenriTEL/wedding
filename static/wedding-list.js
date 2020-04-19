fetch('api/wedding-list')
  .then((response) => {
    return response.json();
  })
  .then((items) => {
    console.log(items);
    insert_items(items)
  });

function insert_items(items) {
  if ('content' in document.createElement('template')) {
    var template = document.querySelector('#item');
    var ul = document.querySelector("#items");
    for (var item in items) {
      var li = template.content.cloneNode(true);
      li.querySelector("a").setAttribute("href", "/");
      li.querySelector("h5").textContent = item;
      li.querySelector("h6").textContent = `${items[item].price / 100} €`;
      ul.appendChild(li);
    }
  } else {
    alert('Votre navigateur est trop ancien pour afficher ce site, veuillez le mettre à jour.')
  }
}