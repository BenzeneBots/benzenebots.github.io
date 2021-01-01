const loadNav = () => {
    let pathname = window.location.pathname.split('/');
    delete pathname[pathname.length-1];
    pathname = pathname.join('/');

    document.querySelector(`nav li a[href="${pathname}"]`).parentNode.classList.add('active');
    document.querySelector(`.sidenav li a[href="${pathname}"]`).parentNode.classList.add('active');

    M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {hover: true, constrainWidth: false});
    M.Sidenav.init(document.querySelectorAll('.sidenav'), {});
};

fetch('/partials/meta.html')
.then((res) => res.text())
.then((data) => document.head.innerHTML += data)
.catch((err) => console.error(err));

fetch('/partials/nav.html')
.then((res) => res.text())
.then((data) => {
    document.body.innerHTML = data + document.body.innerHTML;
    loadNav();
})
.catch((err) => console.error(err));

fetch('/partials/footer.html')
.then((res) => res.text())
.then((data) => document.body.innerHTML += data)
.catch((err) => console.error(err));