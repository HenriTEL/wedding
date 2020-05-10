if ('content' in document.createElement('template')) {
  var item_template = document.querySelector('#item');
} else {
  alert('Votre navigateur est trop ancien pour afficher cette page, veuillez le mettre à jour.')
}
var url = new URL(location.href);
var items_ul = document.querySelector("#items");
var categories_select = document.querySelector('#categories');
var payment_modal = document.querySelector('#paymentModal');
var notifications = document.querySelector('#notifications');


function init_items_cards(items) {
  let categories = new Set();
  let selected_item = url.searchParams.get('item');
  for (item of items) {
    let item_li = _add_item_li(item);
    categories.add(item.category);
    if (sanitize_str(item.name) == selected_item) {
      $('#paymentModal').modal('show');
      update_modal(item_li);
    }
  }
  for (category of Array.from(categories).sort()) {
    _add_category_option(category);
  }
  const url_category = url.searchParams.get('category')
  if (url_category) {
    categories_select.value = url_category;
    refresh_items_cards();
  }
}


function refresh_items_cards() {
  selected_category = document.getElementById('categories').value;
  _set_url(url.searchParams.get('item'));
  for (item_li of items_ul.querySelectorAll("li")) {
    if (selected_category == 'Toutes' || item_li.getAttribute('data-category') == selected_category) {
      item_li.style.display = "initial";
    } else {
      item_li.style.display = "none";
    }
  }
}


function alert_payment(status, details=null) {
  const statuses = ['fail', 'success', 'cancel'];
  let notification = document.querySelector('#notification').content.cloneNode(true);
  notifications.appendChild(notification);
  notification_div = notifications.lastElementChild;
  if (status == 'fail') {
    notification_div.classList.add('alert-danger');
  } else if (status == 'success') {
    notification_div.classList.add('alert-success');
  } else if (status == 'cancel') {
    notification_div.classList.add('alert-warning');
  }
  if (details) {
    notification_div.querySelector('.details').textContent = details;
  }
  for (s of statuses) {
    if (s != status) {
      notification_div.querySelector(`.${s}`).style.display = "none";
    }
  }
}


function update_modal(item_li) {
  const title = item_li.querySelector(".text-body").textContent;
  const remain = item_li.getAttribute('data-remain');
  _set_url(title);
  payment_modal.querySelector('.modal-title').textContent = title;
  payment_modal.querySelector('img').src = item_li.querySelector(".card-img-top").src;
  payment_modal.querySelector('.contribution').setAttribute('max', remain);
  payment_modal.querySelector('.contribution').value = remain;
}


function pay() {
  const MAX = Math.round(payment_modal.querySelector('.contribution').getAttribute('max') * 100);
  const MIN = (MAX < 500) ? MAX : 500;
  let amount_cent = Math.round(payment_modal.querySelector('.contribution').value * 100);
  if (amount_cent < MIN) {
    amount_cent = MIN;
  } else if (amount_cent > MAX) {
    amount_cent = MAX;
  }

  const create_checkout_request = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      item_id: sanitize_str(payment_modal.querySelector('.modal-title').textContent),
      amount_cent: amount_cent,
      contributor_name: payment_modal.querySelector('#contributor-name').value,
      message: payment_modal.querySelector('#contribution-message').value
    })
  }

  fetch('/api/stripe-checkout-session', create_checkout_request)
  .then(function (result) {
    return result.json();
  })
  .then(function (data) {
    stripe.redirectToCheckout({
        sessionId: data.sessionId,
    })
    .then(handle_checkout_result);
  });
}


function handle_checkout_result(result) {
  if (result.error) {
    alert_payment('fail', result.error.message);
  }
};


function _add_category_option(category) {
  let category_option = document.createElement("option");
  category_option.value = sanitize_str(category);
  category_option.textContent = category;
  categories_select.appendChild(category_option);
}


function _add_item_li(item) {
  let item_li = item_template.content.cloneNode(true);
  item_li.querySelector(".text-body").textContent = item.name;
  const remain = (item.price_cent - item.contribution_amount) / 100;
  if (item.contribution_amount > 0) {
    item_tag += `${remain} € restant sur un total de `
  }
  item_tag += `<strong>${item.price_cent / 100} €</strong>`
  item_li.querySelector(".text-muted").textContent = item_tag;
  items_ul.appendChild(item_li);
  item_li = items_ul.lastElementChild;
  item_li.setAttribute('data-category', sanitize_str(item.category));
  item_li.setAttribute('data-remain', remain);
  item_li.querySelector(".card-img-top").setAttribute('src', `/img/wedding-list/${item.image}`);
  return item_li;
}


function _set_url(item=null) {
  let category = document.getElementById('categories').value;
  if (category == 'Toutes') {
    url.searchParams.delete('category');
  } else {
    url.searchParams.set('category', category);
  }
  if (item == null) {
    url.searchParams.delete('item');
  } else {
    url.searchParams.set('item', sanitize_str(item));
  }
  window.history.replaceState("", "", url.href);
}


function sanitize_str(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "_");
}


const checkout_status = url.searchParams.get('checkout_status')
if (checkout_status == 'success') {
  alert_payment('success');
} else if (checkout_status == 'cancel') {
  alert_payment('cancel');
}
fetch('api/wedding-list')
  .then(function(response) {
    return response.json();
  })
  .then(function(items) {
    init_items_cards(items);
  });
const public_key = payment_modal.getAttribute('data-stripe-public-key');
var stripe = Stripe(public_key);
