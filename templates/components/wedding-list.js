if ('content' in document.createElement('template')) {
  var item_template = document.querySelector('#item');
} else {
  alert('Votre navigateur est trop ancien pour afficher cette page, veuillez le mettre à jour.')
}
var url = new URL(location.href);
var items_ul = document.querySelector("#items");
var categories_select = document.querySelector('#categories');

function init_items_cards(items) {
  let categories = new Set()
  for (item of items) {
    _add_item_li(item);
    categories.add(item.category);
  }
  for (category of Array.from(categories).sort()) {
    _add_category_option(category);
  }
  let url_category = url.searchParams.get('category')
  if (url_category) {
    categories_select.value = url_category;
    refresh_items_cards();
  }
}

function refresh_items_cards() {
  selected_category = document.getElementById('categories').value;
  _set_url_category(selected_category);
  for (item_li of items_ul.querySelectorAll("li")) {
    if (selected_category == 'Toutes' || item_li.getAttribute('data-category') == selected_category) {
      item_li.style.display = "initial";
    } else {
      item_li.style.display = "none";
    }
  }
}

function _add_category_option(category) {
  let category_option = document.createElement("option");
  category_option.value = category.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  category_option.textContent = category;
  categories_select.appendChild(category_option);
}

function _add_item_li(item) {
  let item_li = item_template.content.cloneNode(true);
  item_li.querySelector(".text-body").textContent = item.name;
  item_li.querySelector(".text-muted").textContent = `${item.price / 100} €`;
  items_ul.appendChild(item_li);
  item_li = items_ul.lastElementChild;
  item_li.setAttribute('data-category',
                       item.category.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
  item_li.querySelector(".card-img-top").setAttribute('src', `/img/wedding-list/${item.image}`);
}

function _set_url_category(category) {
  if (category == 'Toutes') {
    url.searchParams.delete('category', category);
    window.history.pushState("", "", location.pathname);
  } else {
    url.searchParams.set('category', category);
    window.history.pushState("", "", `${location.pathname}?${url.searchParams}`);
  }
}

fetch('api/wedding-list')
  .then((response) => {
    return response.json();
  })
  .then((items) => {
    init_items_cards(items);
  });