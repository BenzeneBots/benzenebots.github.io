function getAllUsers() {
    const id = localStorage.getItem("id");
    const password = localStorage.getItem("password");
    
    fetch(API_ROOT + '/users', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            id: id,
            password: password
        }
    })
    .then(res => res.json())
    .then(json => {
        if (json.users) {
            let users = json.users
            let displayElement = document.getElementById("display-users")
            for (i = 0; i < users.length; i++) {
                let user = users[i]
                let profileURL = "/admin/users?id="+user.id
                let role;

                if (user.role === 0) {
                    role = "Admin"
                }
                else if (user.role === 1) {
                    role = "Editor"
                }
                else {
                    role = "Viewer"
                }

                displayElement.innerHTML += `<tr class="card-panel red darken-2">
                                                <td>${i + 1}</td><td>${user.id}</td>                        
                                                <td>${user.name}</td>                        
                                                <td>${user.email}</td>                       
                                                <td>${role}</td>                        
                                                <td style="background: transparent" > 
                                                    <div class="column center">                            
                                                        <a class="btn green darken-2" href=${profileURL}>Edit</a>                        
                                                    </div>
                                                </td>                       
                                             </tr>`
            }
        }
    })
    .catch(err => {
        throw err;
    })
}
