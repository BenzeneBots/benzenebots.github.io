let params = {}

function confirmPass()  {
    if (document.getElementById("confirm_password").value !== document.getElementById("new_password").value) {
        document.getElementById("password-error").innerText = "Passwords don't match"
        setInterval(() => {
            document.getElementById("password-error").innerText = " ";
        },3000)
        return false
    }
    else {
        document.getElementById("password-error").innerText = ""
        return true
    }
}

function checkExpire() {
    let search = window.location.search.toString().replace("?","").split("&")

    search.forEach((value, index) => {
        if (value.toString().split("=")) {
            let rawParams = value.toString().split("=")
            params[rawParams[0]] = rawParams[1]
        }
    })

    fetch(API_ROOT + `/temp/${params.sessionId}/expiration`, {
        method: "GET",
        headers: {
            id: localStorage.id,
            password: localStorage.password
        }
    })
        .then(res => res.json())
        .then(json => {
            console.log(json)
            if (!json.expired || json.error) {
                window.location = "localhost:232"
            }
        })
}

const addSubmitListener = () => {
    document.forms[0].addEventListener('submit', (evt) => {
        evt.preventDefault();
    });
}

addSubmitListener();
setTimeout(addSubmitListener, 1e3);
setTimeout(addSubmitListener, 3e3);

async function handleFormSubmit() {
    let proceed = confirmPass()

    if (proceed) {
        let password = document.getElementById("confirm_password").value
        let hashedPassword = await new Promise((resolve, reject) => crypto.subtle.digest('SHA-256', (new TextEncoder()).encode(password)).then(hash => {
            resolve(Array.prototype.map.call(new Uint8Array(hash), x => ('00' + x.toString(16)).slice(-2)).join(''));
        }));

        let data = {
            "id": params.sessionId,
            "password": hashedPassword,
            "userId": params.userId
        }

        fetch(API_ROOT + `/user/${params.userId}/resetpassword`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                id: localStorage.id,
                password: localStorage.password
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(json => {

                if (json.success) {
                    window.location = "/admin/"
                }
                else {
                    window.location = "/"
                }
            })
            .catch(err => {
                M.toast({
                    text: err.message
                });
            });
    }
    else {
        document.getElementById("password-error").innerText = "Passwords don't match"
        setInterval(() => {
            document.getElementById("password-error").innerText = " ";
        },3000)
    }
}

