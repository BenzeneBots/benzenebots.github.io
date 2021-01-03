const API_ROOT = 'https://api.benzenebots.com';

const blogList = (s = 0, e = 20) => {
    fetch(API_ROOT + '/posts/' + s + '/' + e)
        .then((res) => res.json())
        .then((posts) => {
            let out = document.getElementById('out');
            for (let post of posts.posts) {
                out.appendChild(generatePost(post));
            }
        });
};

const blogStandalone = (id) => {
    fetch(API_ROOT + '/post/' + id)
        .then((res) => res.json())
        .then((post) => {
            let out = document.getElementById('out');
            out.appendChild(generatePost(post.post, true));
        });
}

const blogHomepage = () => {
    fetch(API_ROOT + '/posts/0/4')
        .then((res) => res.json())
        .then((posts) => {
            let out = document.getElementById('out');
            for (let post of posts.posts) {
                post.images = JSON.parse(post.images);
                out.appendChild(generateCard(post));
            }
            if (posts.posts.length < 4) {
                let push = document.createElement('div');
                push.classList.add('col');
                push.classList.add('m'+(3*(4-posts.posts.length)));
                push.classList.add('hide-on-small-only');
                out.appendChild(push);
            }
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
    d.innerHTML = moment(new Date(post.published)).utcOffset(0).format('LLL');
    elm.appendChild(d);

    let b = document.createElement('div');
    b.classList.add('post-body');
    b.innerHTML = md(post.content, {breaks: true});
    elm.appendChild(b);

    return elm;
}

const cleanUpContent = (content) => {
    let list = content.replaceAll(/#.+\n/g, '').replaceAll(/!\[.+\]\(.+\)/g, '').split('\n');
    if (list[0].length < 120 && list.length > 1) return list[0]+list[1];
    return list[0];
}

const generateCard = (post) => {
    let elm = document.createElement('div');
    elm.classList.add('col');
    elm.classList.add('s6');
    elm.classList.add('m3');
    elm.id = post.id;

    let card = document.createElement('div');
    card.classList.add('card');
    card.classList.add('grey');
    card.classList.add('darken-4');
    elm.appendChild(card);

    let cardImg = document.createElement('div');
    cardImg.classList.add('card-image');
    card.appendChild(cardImg);

    let img = document.createElement('img');
    img.src = (post.images.length > 0) ? 'https://api.benzenebots.com/'+post.images[0] : '/img/img2.webp';
    cardImg.appendChild(img);

    let h = document.createElement('span');
    h.classList.add('card-title');
    h.classList.add('truncate');
    h.innerHTML = post.title;
    cardImg.appendChild(h);

    let cardContent = document.createElement('div');
    cardContent.classList.add('card-content');
    cardContent.innerHTML = `<div style="font-size: 10pt; margin-bottom: 10px">Published ${moment(new Date(post.published)).utcOffset(0).format('LL')}</div>\n${md(cleanUpContent(post.content))}`;
    card.appendChild(cardContent);

    let action = document.createElement('div');
    action.classList.add('card-action');
    card.appendChild(action);

    let a = document.createElement('a');
    a.classList.add('red-text');
    a.classList.add('text-darken-3');
    a.innerHTML = 'Read More';
    a.href = `/blog/post.html?id=${post.id}`;
    action.appendChild(a);

    return elm;
}
