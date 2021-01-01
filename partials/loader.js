let pathname = window.location.pathname.split('/');
delete pathname[pathname.length-1];
pathname = pathname.join('/');

const loadNav = () => {
    document.querySelector(`nav li a[href="${pathname}"]`).parentNode.classList.add('active');
    M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {hover: true, constrainWidth: false});
};

const loadMobileNav = () => {
    document.querySelector(`.sidenav li a[href="${pathname}"]`).parentNode.classList.add('active');
    M.Sidenav.init(document.querySelectorAll('.sidenav'), {});
};

fetch('/partials/meta.html')
.then((res) => res.text())
.then((data) => document.head.innerHTML += data)
.catch((err) => console.error(err));


fetch('/partials/nav.html')
.then((res) => res.text())
.then((data) => {
    document.getElementById('nav').innerHTML = data;
    loadNav();
    // Imagine writing good code
    setTimeout(loadNav, 1e3);
    setTimeout(loadNav, 3e3);
})
.catch((err) => console.error(err));

fetch('/partials/mobile-nav.html')
.then((res) => res.text())
.then((data) => {
    document.getElementById('mobile-nav').innerHTML = data;
    loadMobileNav();
    setTimeout(loadMobileNav, 1e3);
    setTimeout(loadMobileNav, 3e3);
})
.catch((err) => console.error(err));

fetch('/partials/footer.html')
.then((res) => res.text())
.then((data) => document.body.innerHTML += data)
.catch((err) => console.error(err));