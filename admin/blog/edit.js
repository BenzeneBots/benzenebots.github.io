let editor
const today = () => {
    let date = new Date();
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
let post = {
    published: today(),
    title: 'Test',
    content: '**this is example content**\n\nvery good stuff'
};

window.addEventListener('navload', () => {
    document.getElementById('editor').innerHTML = post.content;
    editor = ace.edit('editor');
    editor.setTheme('ace/theme/twilight');
    editor.session.setMode('ace/mode/markdown');

    document.getElementById('preview').innerHTML = md(editor.getValue());
    editor.session.on('change', () => {
        document.getElementById('preview').innerHTML = md(editor.getValue())
    });

    document.getElementById('title').value = post.title;
    document.getElementById('title-preview').innerHTML = document.getElementById('title').value;
    document.getElementById('title').addEventListener('keyup', () => {
        document.getElementById('title-preview').innerHTML = document.getElementById('title').value;
    });
    M.updateTextFields();

    document.getElementById('date').innerHTML = moment(new Date(post.published)).utcOffset(-60*5).format('LLL');
});