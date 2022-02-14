let editor;
let modals;
const today = () => {
    let date = new Date();
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};
let post = {
    published: today(),
    title: '',
    content: '',
    images: []
};
let postModified = post;
