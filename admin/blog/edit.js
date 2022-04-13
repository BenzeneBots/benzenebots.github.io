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

// TinyMCE functions
function editorRefresh() {
    let editorContent = tinymce.activeEditor.getContent();
   // document.getElementById('preview').innerHTML = editorContent
    localStorage.setItem("blog_draft",editorContent)
}

function editorInit() {
    if (localStorage.getItem("blog_draft") !== null) tinymce.activeEditor.setContent(localStorage.getItem("blog_draft"));
   // document.getElementById('preview').innerHTML = localStorage.getItem("blog_draft")
    editorRefresh();
}

let configTinyMCE = {
    selector: 'textarea',
    theme_advanced_resizing : false,
    resize: false,
    plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste imagetools wordcount',
        'codesample emoticons media wordcount slashcommands'
    ],
    toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media| emoticons codesample wordcount | gallery',
    editor: "restore_draft",
    toolbar_mode: 'floating',
    automatic_uploads: true,
    image_title: true,
    file_picker_types: 'image',
    file_picker_callback: function (cb, value, meta) {
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');

        input.onchange = function () {
            var file = this.files[0];

            var reader = new FileReader();
            reader.onload = async function () {
                const formData = new FormData()
                formData.append('image', file)

                let uploadData = await fetch('https://api.benzenebots.com/store/upload', {
                    method: 'POST',
                    "headers": {
                        "password": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
                        "id": "a34de56a-bb3a-483a-8d96-e95f885b3396",
                    },
                    body: formData
                })
                let uploadJson = await uploadData.json();

                let galleryData = await fetch('https://api.benzenebots.com/gallery', {
                    method: 'POST',
                    "headers": {
                        "password": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
                        "id": "a34de56a-bb3a-483a-8d96-e95f885b3396",
                    },
                    body: formData
                })
                let galleryJson = await galleryData.json();

                cb("https://api.benzenebots.com/"+uploadJson.id, { title: file.name });
            };


            reader.readAsDataURL(file);
        };

        input.click();
    },
    setup : function(editor) {
        editor.on('init', editorInit);
        editor.on('Paste Change input Undo Redo', function(e) {
            editorRefresh()
        });
        editor.ui.registry.addButton('gallery', {
            icon : `gallery`,
            onAction: function (_) {
                tinyMCE.activeEditor.windowManager.open({
                    title: 'My Gallery', // The dialog's title - displayed in the dialog header
                    size: 'large',
                    body: {
                        type: 'panel', // The root body type - a Panel or TabPanel
                        items: [ // A list of panel components
                            {
                                type: 'htmlpanel', // A HTML panel component
                                html: '<div class="gallery-div"><input type="hidden" id="image"/>Your Gallery Items Html</div>'
                            }
                        ]
                    },
                    buttons: [
                        {
                            type: 'cancel',
                            name: 'closeButton',
                            text: 'Cancel'
                        },
                        {
                            type: 'submit',
                            name: 'submitButton',
                            text: 'Insert To Editor',
                            primary: true
                        }
                    ],
                    onSubmit: function (api) {

                    }
                });
            }
        });
    },
    image_caption: true,
    branding: false,
    skin: "oxide-dark",
    icons: "thin",
    content_css: "dark",
}
tinymce.PluginManager.add('slashcommands', function (editor) {
    var insertActions = [
        {
            text: 'Heading 1',
            icon: 'h1',
            action: function () {
                editor.execCommand('mceInsertContent', false, '<h1>Heading 1</h1>')
                editor.selection.select(editor.selection.getNode());
            }
        },
        {
            text: 'Heading 2',
            icon: 'h2',
            action: function () {
                editor.execCommand('mceInsertContent', false, '<h2>Heading 2</h2>');
                editor.selection.select(editor.selection.getNode());
            }
        },
        {
            text: 'Heading 3',
            icon: 'h3',
            action: function () {
                editor.execCommand('mceInsertContent', false, '<h3>Heading 3</h3>');
                editor.selection.select(editor.selection.getNode());
            }
        },
        {
            type: 'separator'
        },
        {
            text: 'Paragraph',
            icon: 'p',
            action: function () {
                editor.execCommand('mceInsertContent', false, '<p>Paragraph</p>');
                editor.selection.select(editor.selection.getNode());
            }
        },
        {
            type: 'separator'
        },
        {
            text: 'Bulleted list',
            icon: 'unordered-list',
            action: function () {
                editor.execCommand('InsertUnorderedList', false);
            }
        },
        {
            text: 'Numbered list',
            icon: 'ordered-list',
            action: function () {
                editor.execCommand('InsertOrderedList', false);
            }
        }
    ];

    // Register the slash commands autocompleter
    editor.ui.registry.addAutocompleter('slashcommands', {
        ch: '/',
        minChars: 0,
        columns: 1,
        fetch: function (pattern) {
            const matchedActions = insertActions.filter(function (action) {
                return action.type === 'separator' ||
                    action.text.toLowerCase().indexOf(pattern.toLowerCase()) !== -1;
            });

            return new tinymce.util.Promise(function (resolve) {
                var results = matchedActions.map(function (action) {
                    return {
                        meta: action,
                        text: action.text,
                        icon: action.icon,
                        value: action.text,
                        type: action.type
                    }
                });
                resolve(results);
            });
        },
        onAction: function (autocompleteApi, rng, action, meta) {
            editor.selection.setRng(rng);
            // Some actions don't delete the "slash", so we delete all the slash
            // command content before performing the action
            editor.execCommand('Delete');
            meta.action();
            autocompleteApi.hide();
        }
    });
    return {};
});

tinyMCE.remove('textarea')
tinyMCE.init(configTinyMCE);
