fetch('api/wedding-list')
  .then((response) => {
    return response.json();
  })
  .then((items) => {
    init_items_cards(items);
  });

function init_items_cards(items) {
  let items_ul = document.querySelector("#items");
  let categories = new Set()
  if ('content' in document.createElement('template')) {
    var item_template = document.querySelector('#item');
  } else {
    alert('Votre navigateur est trop ancien pour afficher cette page, veuillez le mettre à jour.')
  }
  for (item in items) {
    let item_li = item_template.content.cloneNode(true);
    console.log(item_li);
    item_li.querySelector(".text-body").textContent = item;
    item_li.querySelector(".text-muted").textContent = `${items[item].price / 100} €`;
    items_ul.appendChild(item_li);
    items_ul.lastElementChild.setAttribute('data-category', items[item].category)

    categories.add(items[item].category);
  }
  categories_select = document.getElementById('categories');
  for (category of categories) {
    let category_option = document.createElement("option");
    category_option.value = category
    category_option.textContent = category
    categories_select.appendChild(category_option);
  }
}

function refresh_items_cards() {
  selected_category = document.getElementById('categories').value;
  for (item_li of document.querySelector("#items").querySelectorAll("li")) {
    if (selected_category == 'Toutes' || item_li.getAttribute('data-category') == selected_category) {
      item_li.style.display = "initial";
    } else {
      item_li.style.display = "none";
    }
  }
}
  