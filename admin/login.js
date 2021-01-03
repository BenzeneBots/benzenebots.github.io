const API_ROOT = 'https://api.benzenebots.com';

const login = async (password, email) => {
    let hashedPassword = await new Promise((resolve, reject) => crypto.subtle.digest('SHA-256', (new TextEncoder()).encode(password)).then(hash => {
        resolve(Array.prototype.map.call(new Uint8Array(hash), x => ('00' + x.toString(16)).slice(-2)).join(''));
    }));

    fetch(API_ROOT + '/user/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: hashedPassword
            })
        })
        .then(res => res.json())
        .then(json => {
            if (json.user) {
                localStorage.setItem("id", json.user.id);
                localStorage.setItem("password", json.user.password);
                window.location.href = "/admin/";
            } else {
                document.getElementById("login-error").innerText = json.error;
            }
        })
        .catch(err => {
            M.toast({
                text: err.message
            });
        });
};

const handleFormSubmit = () => {
    login(document.forms[0].elements[1].value, document.forms[0].elements[0].value);
}

const addSubmitListener = () => {
    document.forms[0].addEventListener('submit', (evt) => {
        evt.preventDefault();
    });
    if (localStorage.id) {
        fetch(API_ROOT + '/user/auth', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: localStorage.id,
                password: localStorage.password
            })
        })
        .then(res => res.json())
        .then(json => {
            if (json.user) {
                window.location.href = "/admin/";
            } else {
                document.getElementById("login-error").innerText = json.error;
                localStorage.removeItem('id');
                localStorage.removeItem('password');
            }
        })
        .catch(err => {
            M.toast({
                text: err.message
            });
        });
    }
}

addSubmitListener();
setTimeout(addSubmitListener, 1e3);
setTimeout(addSubmitListener, 3e3);
