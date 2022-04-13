const path =  require("path");

const minify = import("minify");
const imageExtensions = require('image-extensions');
const fs = require("fs");

const options = {
    "html": {
        "removeComments": true,
        "minifyJS": true,
        "minifyCSS": true
    },
    "css": {
        "compatibility": "*"
    },
    "js": {
        "ecma": 5
    },
    "img": {
        "maxSize": 4096
    }
}

const ignoreFolders = [".git",".idea","minified","node_modules"]
const ignoreFiles = ["package.json","package-lock.json","minification.js"]
const havFiles = [".gitignore",".gitattributes",".htaccess","CNAME"]
const havFolders = ["img"]
const EXT = ['js', 'html', 'css'];

function copyFileSync( source, target ) {

    var targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
    var files = [];

    // Check if folder needs to be created or integrated
    var targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    // Copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}

let folderNest = async(folder) => {
    if (!fs.existsSync(__dirname + "\\minified\\" + folder)) {
        fs.mkdirSync(__dirname + "\\minified\\" + folder)
    }

    fs.readdir(__dirname + "\\" + folder, (err, files) => {
        files.forEach(async (item) => {
            if (fs.lstatSync(__dirname + "\\" + folder + "\\" +item).isDirectory()) {
                if (havFolders.includes(folder + "/" +item)) {
                    copyFolderRecursiveSync(__dirname + "\\"+folder + "\\" +item,__dirname + "\\minified\\" + folder )
                }
                else {
                    if (!ignoreFolders.includes(item)) {
                        await folderNest(folder + "\\" +item)
                    }
                }
            }
            else {
                const ext = path.extname(item).slice(1);
                const is = EXT.includes(ext);

                if (havFiles.includes(folder + "/" +item)) {
                    let data = fs.readFileSync(__dirname + "\\" + folder + "\\" +item)
                    fs.writeFileSync(__dirname + "\\minified\\" + folder + "\\" + item,data)
                    return;
                }

                if (!is) {
                    return
                }
                if (ignoreFiles.includes(folder + "\\" +item)) return

                let data = await (await minify).minify(__dirname + "\\" + folder +"\\"+item , options)
                fs.writeFileSync(__dirname + "\\minified\\" + folder + "\\" + item,data)


            }
        })
    })
}

let start = async() => {
    fs.readdir(__dirname, (err, files) => {
        files.forEach(async (item) => {
            if (fs.lstatSync(__dirname + "\\"+item).isDirectory()) {
                if (havFolders.includes(item)) {
                    copyFolderRecursiveSync(__dirname + "\\"+item,__dirname + "\\minified\\")
                }
                else {
                    if (!ignoreFolders.includes(item)) {
                        await folderNest(item)
                    }
                }

            }
            else {

                const ext = path.extname(item).slice(1);
                const is = EXT.includes(ext);

                if (havFiles.includes(item)) {
                    let data = fs.readFileSync(__dirname + "\\" + item)
                    fs.writeFileSync(__dirname + "\\minified\\" + item,data)
                    return;
                }

                if (!is) {
                    return
                }
                if (ignoreFiles.includes(item)) return


                fs.writeFileSync(__dirname + "\\minified\\" + item,data)


            }
        })
    })
}

(async () => {
    let data = await (await minify).minify(__dirname + "\\"+"test.html",options)
    console.log(data)
})()
