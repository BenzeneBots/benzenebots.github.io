let album = {
    id: '',
    name: '',
    weight: 0,
    images: []
}
let dropzone = document.getElementById('drop-area');
let uploading = false;

const uploadFile = async (file) => {
    let formData = new FormData()
    formData.append('image', file)

    return await fetch(API_ROOT + '/store/upload', {
        method: 'POST',
        body: formData,
        headers: {
            id: auth.id,
            password: auth.password
        }
    }).then((res) => res.json());
}

const dropHandler = async (ev) => {
    ev.preventDefault();
    uploading = true;

    M.toast({
        html: 'Uploading... Please wait'
    });
    let uploads = [];
    for (let file of ev.dataTransfer.files) {
        uploads.push(new Promise((resolve, reject) => {
            uploadFile(file).then((upload) => {
                fetch(API_ROOT + '/gallery/' + album.id + '/add/' + upload.id, {
                    method: 'POST',
                    headers: {
                        id: auth.id,
                        password: auth.password
                    }
                }).then(res => resolve());
            })
        }));
    }
    Promise.all(uploads).then(() => {
        getAlbum(album.id);
        M.toast({ html: 'Done!' })
        uploading = false;
    });
}

let timeout;
const dragOverHandler = (ev) => {
    document.getElementById('drop-area').classList.add('highlight');
    clearTimeout(timeout);
    timeout = setTimeout(() => document.getElementById('drop-area').classList.remove('highlight'), 100);

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

const getAlbum = async (id) => {
    album = (await fetch(API_ROOT + '/gallery/' + id).then((res) => res.json())).album;
}

window.addEventListener("beforeunload", function (e) {
    if (uploading) {
        var confirmationMessage = 'Images are still uploading, if you leave now your changes will not be saved';

        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    }
});
