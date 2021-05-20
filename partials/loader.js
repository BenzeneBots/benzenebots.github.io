const API_ROOT = 'https://api.benzenebots.com';

let navLoadEvent = new Event('navload');
let pathname = window.location.pathname.split('/');
delete pathname[pathname.length - 1];
pathname = pathname.join('/');

const loadNav = () => {
    if (!pathname.startsWith('/admin/')) document.querySelector(`nav li a[href="${pathname}"]`).parentNode.classList.add('active');
    M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {
        hover: true,
        constrainWidth: false
    });
};

const loadMobileNav = () => {
    if (!pathname.startsWith('/admin/')) document.querySelector(`.sidenav li a[href="${pathname}"]`).parentNode.classList.add('active');
    M.Sidenav.init(document.querySelectorAll('.sidenav'), {});
};

let promises = [];

promises.push(fetch('/partials/meta.html')
    .then((res) => res.text())
    .then((data) => document.head.innerHTML += data)
    .catch((err) => console.error(err)));


promises.push(fetch('/partials/nav.html')
    .then((res) => res.text())
    .then((data) => {
        document.getElementById('nav').innerHTML = data;
        loadNav();
        // Imagine writing good code
        setTimeout(loadNav, 1e3);
        setTimeout(loadNav, 3e3);
    })
    .catch((err) => console.error(err)));

promises.push(fetch('/partials/mobile-nav.html')
    .then((res) => res.text())
    .then((data) => {
        document.getElementById('mobile-nav').innerHTML = data;
        loadMobileNav();
        setTimeout(loadMobileNav, 1e3);
        setTimeout(loadMobileNav, 3e3);
    })
    .catch((err) => console.error(err)));

promises.push(fetch('/partials/footer.html')
    .then((res) => res.text())
    .then((data) => document.body.innerHTML += data)
    .catch((err) => console.error(err)));

Promise.all(promises).then(() => {
    window.dispatchEvent(navLoadEvent);
})

let cache_bust = () => {
    let scripts = document.getElementsByTagName("script")

    for (var i = 0; i <= scripts.length; i++) {
        let script = scripts.item(i)
        if (script === null) return
        script.setAttribute("src", script.getAttribute("src") + "?v=" + new Date().getTime())
    }
}

window.addEventListener("load", () => {
    cache_bust()
})