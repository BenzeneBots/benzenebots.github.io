function login() {
    let password = document.getElementById("password").value;
    let email = document.getElementById("email").value;
    return crypto.subtle.digest('SHA-256', (new TextEncoder()).encode(password)).then(hash => {
        let hashedPassword = Array.prototype.map.call(new Uint8Array(hash), x => ('00' + x.toString(16)).slice(-2)).join('');
        fetch('https://api.benzenebots.com/user/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email:email,password:hashedPassword})
        }).then(res => res.json()).then(json => {
                if (json.user) {
                    localStorage.setItem("email",email)
                    localStorage.setItem("password",hashedPassword)
                    window.location.href = "/adminPanel/";
                }
                else {
                    document.getElementById("login-error").innerText = json.error;
                    setTimeout(function () {
                        document.getElementById("login-error").innerText = "";
                    },5000)
                }
            })
            .catch(err => {
                console.log(err);
            });
    })
}