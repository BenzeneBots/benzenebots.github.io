const login = async (password, email) => {
    let hashedPassword = await new Promise((resolve, reject) => crypto.subtle.digest('SHA-256', (new TextEncoder()).encode(password)).then(hash => {
        resolve(Array.prototype.map.call(new Uint8Array(hash), x => ('00' + x.toString(16)).slice(-2)).join(''));
    }));

    fetch('https://api.benzenebots.com/user/login', {
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
                localStorage.setItem("id", json.id);
                localStorage.setItem("password", json.password);
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
}

addSubmitListener();
setTimeout(addSubmitListener, 1e3);
setTimeout(addSubmitListener, 3e3);
