function confirmPass()  {
    if (document.getElementById("confirm_password").value !== document.getElementById("new_password").value) {
        document.getElementById("password-error").innerText = "Passwords don't match"
    }
    else {
        document.getElementById("password-error").innerText = ""
    }
}

const addSubmitListener = () => {
    document.forms[0].addEventListener('submit', (evt) => {
        evt.preventDefault();
    });
}

function handleFormSubmit() {
    console.log("Test")
}
addSubmitListener()

