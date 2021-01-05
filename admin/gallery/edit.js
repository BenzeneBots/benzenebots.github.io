
let renderImages = (toast=null) => {
    let tbody = document.getElementById('images');
    let out = '';
    let i = 0;
    let disabled = (localStorage.permissions < 1) ? 'disabled ':'';
    for (let img of images) {
        out += `<tr><td width="50%"><img style="responsive-img" width="100%" src="/img/${img}"></td>`;
        out += `<td><div class="row center"><a class="${disabled}btn red darken-2" href="#" onclick="removeImg(${i})">Remove</a></div>`;
        out += `<div class="row center"><a class="btn red darken-2${(i<1)?' disabled':''}" onclick="imgUp(${i})"><i class="material-icons">arrow_upward</i></a>`;
        out += `<a class="btn red darken-2${(i>=images.length-1)?' disabled':''}" onclick="imgDown(${i})"><i class="material-icons">arrow_downward</i></a></div></td>`;
        i++;
    }
    tbody.innerHTML = out;
    if (toast!==null) toast.dismiss();
}

let removeImg = (i) => {
    fetch('/api/image/'+images[i]+'/remove', {method: 'POST', headers: {id: localStorage.id, password: localStorage.password}}).then(res => res.json()).then(res => {
        if (res.status !== 200) {
            M.toast({html: "Image deletion failed<br>"+res.message});
        } else {
            let newArr = [];
            for (let j = 0; j < i; j++) {
                newArr.push(images[j]);
            }
            for (let k = i+1; k < images.length; k++) {
                newArr.push(images[k]);
            }
            images = newArr;
            renderImages();
        }
    });
}

let imgUp = (i) => {
    let newArr = [];
    for (let j = 0; j+1 < i; j++) {
        newArr.push(images[j]);
    }
    newArr.push(images[i]);
    newArr.push(images[i-1]);
    for (let k = i+1; k < images.length; k++) {
        newArr.push(images[k]);
    }
    images = newArr;
    renderImages();
}

let imgDown = (i) => {
    let newArr = [];
    for (let j = 0; j < i; j++) {
        newArr.push(images[j]);
    }
    newArr.push(images[i+1]);
    newArr.push(images[i]);
    for (let k = i+2; k < images.length; k++) {
        newArr.push(images[k]);
    }
    images = newArr;
    renderImages();
}

let uploadImages = () => {
    let toast = M.toast({html: 'Uploading, please wait'});
    let files = document.forms[0].imageUpload.files;
    console.log(files);
    let promises = [];
    for (let img of files) {
        promises.push(new Promise((resolve, reject) => {
            fetch('/api/image/add', {
                method: 'POST',
                headers: {id: localStorage.id, password: localStorage.password},
                body: img
            }).then(res => res.json()).then(res => resolve(res));
        }))
    }
    Promise.all(promises).then((files) => {
        for (let img of files) {
            if (img.status !== 200) {
                M.toast({html: 'Failed upload image<br>'+img.message});
            } else {
                images.push(img.message);
            }
        }
        renderImages(toast);
        document.forms[0].imageUpload.value = '';
    });
}