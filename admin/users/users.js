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