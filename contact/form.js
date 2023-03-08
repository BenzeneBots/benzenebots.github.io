const resError = (dispID,errorID, errorMsg) => {
    document.getElementById(errorID).innerText = errorMsg
    window.location.href = "/scout/form.html#"+dispID

    setTimeout(() => {
        document.getElementById(errorID).innerText = ""
    }, 5000)
}

const submit_form = () => {
    let name = document.getElementById("name");
    let email = document.getElementById("message");
    let message = document.getElementById("email");

    let canSend = true;

    if (!canSend) return

    fetch(API_ROOT + '/contact_us/add', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            id: localStorage.id,
            password: localStorage.password
        },
        body: JSON.stringify({
            name: name.value,
            email: email.value,
            message: message.value
        })
    }).then((res => res.json())).then(json => {
        if (!json.error) {
            window.location.href = "/scout/form_finish.html"
        }
        else {
            resError("message_disp","message_error","Invalid")

        }
    }).catch(err => {
        console.error(err)
        resError("message_disp","message_error","Invalid")
    })
}
