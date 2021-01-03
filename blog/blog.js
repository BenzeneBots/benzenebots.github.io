const API_ROOT = 'https://api.benzenebots.com';

const fetchPosts = (s = 0, e = 20) => {
    alert("Ran");
    fetch(API_ROOT + '/posts/' + s + '/' + e)
        .then((res) => res.json())
        .then((posts) => {
            let out = document.getElementById('out');
            for (let post of posts.posts) {
                out.appendChild(generatePost(post));
            }
        });
};

const fetchPost = (id) => {
    fetch(API_ROOT + '/post/' + id)
        .then((res) => res.json())
        .then((post) => {
            let out = document.getElementById('out');
            out.appendChild(generatePost(post.post, true));
        });
}

const generatePost = (post, standalone = false) => {
    let elm = document.createElement('div');
    elm.classList.add('post');
    elm.id = post.id;

    let h = document.createElement('h3');
    h.innerHTML = (standalone) ? post.title : `<a href="/blog/post.html?id=${post.id}">${post.title}</a>`;
    elm.appendChild(h);

    let d = document.createElement('div');
    d.classList.add('post-published-date');
    // This will problem break because DST
    // I hate time
    d.innerHTML = moment(new Date(post.published)).utcOffset(-60 * 10).format('LLL');
    elm.appendChild(d);

    let b = document.createElement('div');
    b.classList.add('post-body');
    b.innerHTML = md(post.content);
    elm.appendChild(b);

    return elm;
}
