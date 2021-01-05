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

window.addEventListener('navload', async () => {
    if (POST_ID) {
        post = (await fetch(API_ROOT + '/post/' + POST_ID)
            .then((res) => res.json())).post;
    }

    if (localStorage.hasOwnProperty(POST_ID || 'draft')) {
        postModified = JSON.parse(localStorage.getItem(POST_ID || 'draft'));
        document.getElementById('editor').innerHTML = postModified.content;
    } else {
        postModified = post;
        document.getElementById('editor').innerHTML = post.content;
    }

    editor = ace.edit('editor');
    editor.session.setUseWrapMode(true)
    editor.setTheme('ace/theme/twilight');
    editor.session.setMode('ace/mode/markdown');

    document.getElementById('preview').innerHTML = md(editor.getValue());
    editor.session.on('change', () => {
        document.getElementById('preview').innerHTML = md(editor.getValue())
        postModified.content = editor.getValue();
        localStorage.setItem(POST_ID || 'draft', JSON.stringify(postModified));
    });

    document.getElementById('title').value = postModified.title;
    document.getElementById('title-preview').innerHTML = document.getElementById('title').value;
    document.getElementById('title').addEventListener('keyup', () => {
        document.getElementById('title-preview').innerHTML = document.getElementById('title').value;
        postModified.title = document.getElementById('title').value;
        localStorage.setItem(POST_ID || 'draft', JSON.stringify(postModified));
    });
    M.updateTextFields();

    document.getElementById('date').innerHTML = moment(new Date(postModified.published)).utcOffset(-60 * 5).format('LLL');

    modals = M.Modal.init(document.querySelectorAll('.modal'), {
        onCloseStart: modalClose
    });

    document.querySelectorAll('#toolbar a').forEach((btn) => {
        btn.addEventListener('click', () => {
            handleFormatButton(btn.id);
            editor.focus();
        });
    });

    document.getElementById('insert-link-submit').addEventListener('click', () => {
        editor.session.insert(editor.getCursorPosition(), `[${document.getElementById('insert-link-display').value}](${document.getElementById('insert-link').value})`);
        editor.focus();
    });

    document.getElementById('insert-image-submit').addEventListener('click', async () => {
        const formData = new FormData()
        formData.append('image', document.getElementById('insert-image').files[0]);
        let json = await fetch(API_ROOT + '/store/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    id: localStorage.id,
                    password: localStorage.password
                }
            })
            .then((res) => res.json());
        if (!json.id) {
            M.toast({
                html: json.error
            });
        } else {
            let filename = document.getElementById('insert-image').value.replaceAll('\\', '/').split('/').pop();
            editor.session.insert(editor.getCursorPosition(), `![${filename}](https://api.benzenebots.com/${json.id})`);
            postModified.images.push(json.id);
        }
        editor.focus();
    });

    document.getElementById('delete').addEventListener('click', () => modals[2].open());
    document.getElementById('delete-submit').addEventListener('click', async () => {
        if (postModified.images.length > 0) {
            await fetch(API_ROOT + '/store/delete', {
                method: 'DELETE',
                body: JSON.stringify({
                    images: postModified.images
                }),
                headers: {
                    "Content-Type": "application/json",
                    id: localStorage.id,
                    password: localStorage.password
                }
            });
        }

        localStorage.removeItem(POST_ID || 'draft');
        M.toast({
            html: 'Draft deleted'
        });
        window.location.href = '/admin/blog/';
    });

    document.getElementById('save').addEventListener('click', async () => {
        if (postModified.title === '') {
            M.toast({
                html: 'You need to add a title before you can publish this.'
            });
            return;
        } else if (postModified.content === '') {
            M.toast({
                html: 'You need to write something before you can publish this.'
            });
            return;
        }
        let json = await fetch(API_ROOT + '/post/' + (POST_ID || ''), {
            method: (POST_ID) ? 'PATCH' : 'POST',
            body: JSON.stringify(postModified),
            headers: {
                "Content-Type": "application/json",
                id: localStorage.id,
                password: localStorage.password
            }
        });

        if (json.hasOwnProperty('error')) {
            M.toast({
                html: json.error
            });
        } else {
            localStorage.removeItem(POST_ID || 'draft');
            window.location.href = '/blog/';
        }
    });
});

const handleFormatButton = (id) => {
    switch (id) {
        case 'tool-bold':
            if (editor.getSelectedText()) {
                editor.session.replace(editor.getSelectionRange(), '**' + editor.getSelectedText() + '**');
            } else {
                editor.session.insert(editor.getCursorPosition(), '****');
                editor.gotoLine(editor.getCursorPosition().row + 1, editor.getCursorPosition().column - 2);
            }
            break;

        case 'tool-italics':
            if (editor.getSelectedText()) {
                editor.session.replace(editor.getSelectionRange(), '*' + editor.getSelectedText() + '*');
            } else {
                editor.session.insert(editor.getCursorPosition(), '**');
                editor.gotoLine(editor.getCursorPosition().row + 1, editor.getCursorPosition().column - 1);
            }
            break;

        case 'tool-strikethrough':
            if (editor.getSelectedText()) {
                editor.session.replace(editor.getSelectionRange(), '~~' + editor.getSelectedText() + '~~');
            } else {
                editor.session.insert(editor.getCursorPosition(), '~~~~');
                editor.gotoLine(editor.getCursorPosition().row + 1, editor.getCursorPosition().column - 2);
            }
            break;

        case 'tool-header':
            if (editor.getSelectedText()) {
                editor.session.replace(editor.getSelectionRange(), '## ' + editor.getSelectedText());
            } else {
                editor.session.insert(editor.getCursorPosition(), '## ');
            }
            break;

        case 'tool-ulist':
            editor.session.insert(editor.getCursorPosition(), '- \n- ');
            editor.gotoLine(editor.getCursorPosition().row, editor.getCursorPosition().column);
            break;

        case 'tool-olist':
            editor.session.insert(editor.getCursorPosition(), '1. \n1. ');
            editor.gotoLine(editor.getCursorPosition().row, editor.getCursorPosition().column);
            break;

        case 'tool-quote':
            if (editor.getSelectedText()) {
                editor.session.replace(editor.getSelectionRange(), '> ' + editor.getSelectedText());
            } else {
                editor.session.insert(editor.getCursorPosition(), '> ');
            }
            break;

        case 'tool-code':
            if (editor.getSelectedText()) {
                editor.session.replace(editor.getSelectionRange(), '`' + editor.getSelectedText() + '`');
            } else {
                editor.session.insert(editor.getCursorPosition(), '``');
                editor.gotoLine(editor.getCursorPosition().row + 1, editor.getCursorPosition().column - 1);
            }
            break;

        case 'tool-link':
            if (editor.getSelectedText()) {
                editor.setReadOnly(true);
                document.getElementById('insert-link-display').value = editor.getSelectedText();
                document.getElementById('insert-link').value = editor.getSelectedText();
                modals[0].open();
                M.updateTextFields();
            } else {
                editor.setReadOnly(true);
                modals[0].open();
            }
            break;

        case 'tool-photo':
            editor.setReadOnly(true);
            modals[1].open();
            break;
    }
}

const modalClose = () => {
    editor.setReadOnly(false);
    setTimeout(() => {
        document.getElementById('insert-link').value = '';
        document.getElementById('insert-link-display').value = '';
        document.getElementById('insert-image').value = '';
        M.updateTextFields();
    }, 3e3);
}
