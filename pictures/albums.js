let allmsn = [];

const loadAlbums = async () => {
    let manifest = await fetch(API_ROOT + '/gallery', {}).then((res) => res.json());
    let out = document.getElementById('out');

    for (let album of manifest.albums) {
        let h = document.createElement('h3');
        h.innerHTML = album.name;
        h.id = album.id;
        out.appendChild(h);

        let g = document.createElement('div');
        g.classList.add('grid');
        out.appendChild(g);

        for (let img of album.images) {
            let i = document.createElement('img');
            i.classList.add('grid-item');
            i.src = API_ROOT + '/' + img;
            g.appendChild(i);
        }
    }

    document.querySelectorAll('.grid').forEach((elm) => {
        imagesLoaded(elm, () => {
            allmsn.push(new Masonry(elm, {
                itemSelector: '.grid-item',
                columnWidth: 400,
                gutter: 10,
                horizontalOrder: true
            }));
        });
    });
};

const listAlbums = async () => {
    let manifest = await fetch(API_ROOT + '/gallery', {}).then((res) => res.json());
    let out = '';
    for (let album of manifest.albums) {
        out += `<tr>
        <td>${album.id}</td>
        <td>${album.name}</td>
        <td>${album.images.length}</td>
        <td><a href="/pictures/#${album.id}" class="btn red darken-3">View</a>
        <a href="/admin/gallery/edit.html?id=${album.id}" class="btn red darken-3">Edit</a>
        <a href="/admin/gallery/delete.html?id=${album.id}" class="btn red darken-3">Delete</a></td>
        </tr>\n`;
    }
    document.getElementById('out').innerHTML = out;
}