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

        let s = document.createElement('div');
        s.classList.add('grid-sizer');
        s.classList.add('col');
        s.classList.add('s1');
        g.appendChild(s);

        for (let img of album.images) {
            let i = document.createElement('img');
            i.classList.add('grid-item');
            i.src = API_ROOT + '/' + img;
            g.appendChild(i);
        }
    }

    document.querySelectorAll('.grid').forEach((elm) => {
        new Masonry(elm, {
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer',
            percentPosition: true
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