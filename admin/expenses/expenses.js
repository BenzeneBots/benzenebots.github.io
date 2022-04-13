var createExpense = async function (name, price) {
    let json = await fetch(API_ROOT + '/expense/' , {
        method: 'POST',
        headers: {
            'Content-Type': "application/json",
            id: auth.id,
            password: auth.password
        },
        body: JSON.stringify({name: name, price: price})
    })
        .then(res => res.json());
    if (json) {
        window.location.href = '/admin/expenses/';
    } else {
        M.toast({
            html: json.error
        });
    }
}

var updateExpense = async function(oldName, newName, price) {

    let json = await fetch(API_ROOT + '/updateExpense/' , {
        method: 'POST',
        headers: {
            'Content-Type': "application/json",
            id: auth.id,
            password: auth.password
        },
        body: JSON.stringify({name: (newName.replaceAll("%20", " ")), price: price, changeName: (oldName.replaceAll("%20", " "))})
    })
        .then(res => res.json());

    if (json) {
       window.location.href = '/admin/expenses/';
    } else {
        M.toast({
            html: json.error
        });
    }
}

var getAllExpenses = async function() {
    let json = await fetch(API_ROOT + '/expense/' , {
        method: 'GET',
        headers: {
            'Content-Type': "application/json",
            id: auth.id,
            password: auth.password
        }
    })
        .then(res => res.json());

    return json
}

var getExpenses = async function() {
    let json = await fetch(API_ROOT + '/expense/' + name + "/" + price, {
        method: 'GET',
        headers: {
            'Content-Type': "application/json",
            id: auth.id,
            password: auth.password
        }
    })
        .then(res => res.json());
    document.getElementById('name').value = json.name;
    document.getElementById('price').value = json.price;

    return json
}

var Delete = async function(element) {
    let json = await fetch(API_ROOT + '/expense/' + element.getAttribute("name").replaceAll("%20", " ") + "/" + element.getAttribute("price"), {
        method: 'DELETE',
        headers: {
            'Content-Type': "application/json",
            id: auth.id,
            password: auth.password
        }
    }).then(res => res.json());

    if (json) {
        window.location.href = '/admin/expenses/';
    } else {
        M.toast({
            html: json.error
        });
    }
}

var initExpenses = async function() {
    let allExpenses = await getAllExpenses();

    allExpenses.forEach((value) => {
        document.getElementById("out").innerHTML += `
                        <tr>
                            <td class="disp">
                                ${value.name}
                            </td>
                            <td class="disp total-cost">
                                $${value.price.toFixed(2)}
                            </td>
                            <td><a class="btn red darken-3" href="/admin/expenses/add.html?name=${value.name}&price=${value.price}">Edit</a></td>                       
                            <td><button class="btn red darken-3" onclick="Delete(this)" name="${value.name}" price="${value.price}">Delete</a></td>
                        </tr>`
    })
}