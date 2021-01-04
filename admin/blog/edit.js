let editor;
let modals;
const today = () => {
    let date = new Date();
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};
let post = {
    published: today(),
    title: '',
    content: ''
};

window.addEventListener('navload', async () => {
    if (POST_ID) {
        post = (await fetch(API_ROOT + '/post/' + POST_ID)
            .then((res) => res.json())).post;
    }

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

    document.getElementById('date').innerHTML = moment(new Date(post.published)).utcOffset(-60 * 5).format('LLL');

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
                text: json.error
            });
        } else {
            let filename = document.getElementById('insert-image').value.replaceAll('\\', '/').split('/').pop();
            editor.session.insert(editor.getCursorPosition(), `![${filename}](https://api.benzenebots.com/${json.id})`);
        }
        editor.focus();
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