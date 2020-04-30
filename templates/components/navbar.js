var url = new URL(location.href);

function set_active_nav_item() {
    for (let nav_link of document.querySelectorAll('.nav-link')) {
        if (nav_link.pathname  == url.pathname) {
            nav_link.parentElement.classList.add("active");
            break;
        }
    }
}

set_active_nav_item();