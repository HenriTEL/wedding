var url = new URL(location.href);
document.querySelectorAll('.nav-link').forEach(function (nav_link) {
    if (nav_link.pathname == url.pathname) {
        nav_link.parentElement.classList.add("active");
    }
});
