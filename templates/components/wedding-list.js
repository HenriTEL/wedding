var url = new URL(location.href)

function init_items_cards(items) {
  let items_ul = document.querySelector("#items");
  let categories = new Set()
  if ('content' in document.createElement('template')) {
    var item_template = document.querySelector('#item');
  } else {
    alert('Votre navigateur est trop ancien pour afficher cette page, veuillez le mettre à jour.')
  }
  for (item of items) {
    let item_li = item_template.content.cloneNode(true);
    item_li.querySelector(".text-body").textContent = item.name;
    item_li.querySelector(".text-muted").textContent = `${item.price / 100} €`;
    items_ul.appendChild(item_li);
    item_li = items_ul.lastElementChild;
    item_li.setAttribute('data-category',
                         item.category.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
    item_li.querySelector(".card-img-top")
      .setAttribute('src', `/img/wedding-list/${item.image}`);
    categories.add(item.category);
  }
  categories_select = document.getElementById('categories');
  for (category of Array.from(categories).sort()) {
    let category_option = document.createElement("option");
    category_option.value = category.normalize("NFD")
                              .replace(/[\u0300-\u036f]/g, "");
    category_option.textContent = category;
    categories_select.appendChild(category_option);
  }
  let url_category = url.searchParams.get('category')
  if (url_category) {
    document.getElementById('categories').value = url_category;
    refresh_items_cards();
  }
}

function refresh_items_cards() {
  selected_category = document.getElementById('categories').value;
  if (selected_category == 'Toutes') {
    url.searchParams.delete('category', selected_category);
    window.history.pushState("", "", location.pathname);
  } else {
    url.searchParams.set('category', selected_category);
    window.history.pushState("", "", `${location.pathname}?${url.searchParams}`);
  }
  for (item_li of document.querySelector("#items").querySelectorAll("li")) {
    if (selected_category == 'Toutes' || item_li.getAttribute('data-category') == selected_category) {
      item_li.style.display = "initial";
    } else {
      item_li.style.display = "none";
    }
  }
}

fetch('api/wedding-list')
  .then((response) => {
    return response.json();
  })
  .then((items) => {
    init_items_cards(items);
  });