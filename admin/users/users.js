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