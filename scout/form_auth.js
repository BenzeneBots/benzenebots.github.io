const validate = async () => {
    let username = document.getElementById("username");
    let password = document.getElementById("password");

    let data = await fetch(API_ROOT + "/scoutingForm", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username.value,
            password: password.value
        })
    }).then(res => res.json())

    if (data.error) {
        document.getElementById("login-error").innerText = data.error

        setTimeout(() => {
            document.getElementById("login-error").innerText = ""
        },5000)
    }
    else if (data.success) {
        localStorage.setItem("scout","letsgooo")
        window.location.href = "/scout/form.html"
    }
}