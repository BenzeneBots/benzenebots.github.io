const ROLES = ['Admin', 'Editor', 'View Only']

const getAllUsers = async () => {
    let json = await fetch(API_ROOT + '/users', {
            method: 'GET',
            headers: {
                id: auth.id,
                password: auth.password
            }
        })
        .then(res => res.json());

    if (json.users) {
        let out = '';
        for (let user of json.users) {
            out += `<tr>
                    <td>${user.id}</td>                        
                    <td>${user.name}</td>                        
                    <td>${user.email}</td>                       
                    <td>${ROLES[user.role]}</td>                        
                    <td><a class="btn red darken-3" href="/admin/users/edit.html?id=${user.id}">Edit</a></td>                       
                </tr>`
        }
        document.getElementById("out").innerHTML = out;
    } else {
        M.toast({
            html: json.error
        });
    }
};

const getUser = async () => {
    let json = await fetch(API_ROOT + '/user/' + USER_ID, {
            method: 'GET',
            headers: {
                id: auth.id,
                password: auth.password
            }
        })
        .then(res => res.json());

    if (json.user) {
        document.getElementById('name').value = json.user.name;
        document.getElementById('email').value = json.user.email;
        for (let i of document.getElementById('role').children) {
            if (i.value === json.user.role) i.selected = 'true';
            else i.selected = 'false';
        }
        setTimeout(() => M.FormSelect.init(document.getElementById('role'), {}), 3e3);
    } else {
        M.toast({
            html: json.error
        });
    }
}

const userObj = async () => {
    let password = document.getElementById('password').value;
    if (password === 'placeholder') {
        return {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            role: document.getElementById('role').parentElement.children[3].value
        }
    }

    let hashedPassword = await new Promise((resolve, reject) => crypto.subtle.digest('SHA-256',
            (new TextEncoder()).encode(password))
        .then(hash => {
            resolve(Array.prototype.map.call(new Uint8Array(hash), x => ('00' + x.toString(16)).slice(-2)).join(''));
        }));

    return {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        role: document.getElementById('role').parentElement.children[3].value,
        password: hashedPassword
    }
}

const createUser = async () => {
    let json = await fetch(API_ROOT + '/user/', {
            method: 'POST',
            headers: {
                id: auth.id,
                password: auth.password
            },
            body: JSON.stringify(await userObj())
        })
        .then(res => res.json());

    if (json.user) {
        window.location.href = '/admin/user';
    } else {
        M.toast({
            html: json.error
        });
    }
}

const updateUser = async () => {
    let json = await fetch(API_ROOT + '/user/' + USER_ID, {
            method: 'POST',
            headers: {
                id: auth.id,
                password: auth.password
            },
            body: JSON.stringify(userObj())
        })
        .then(res => res.json());

    if (json.user) {
        window.location.href = '/admin/user';
    } else {
        M.toast({
            html: json.error
        });
    }
}