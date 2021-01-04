const API_ROOT = 'https://api.benzenebots.com';
let auth = null;
const event = new CustomEvent('auth', { detail: auth });

const runAuth = () => {
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
                auth = json.user;
                window.dispatchEvent(event);
            } else {
                window.dispatchEvent(event);
                localStorage.removeItem('id');
                localStorage.removeItem('password');
            }
        })
        .catch(err => {
            M.toast({
                text: err.message
            });
        });
    } else {
        window.dispatchEvent(event);
    }
}
