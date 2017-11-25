var svelte = require('svelte');
var fs = require('fs');
var path = require('path');

// helper functions to find all directories below a path
var isDirectory = p => fs.lstatSync(p).isDirectory();
var getDirectories = p => fs.readdirSync(p).map(name => path.join(p, name)).filter(isDirectory);

// itterate over all directories in the components dir
getDirectories(path.resolve(__dirname, 'components')).forEach((dir) => {

    // read in our source file
    const source = fs.readFileSync(path.resolve(__dirname, dir, 'Source.html'), 'utf8');

    // compile the component to an es module
    const output = svelte.compile(source, {
        name: 'Component',
        format: 'es',
    });

    // save the resulting code and provide some feedback that it worked
    fs.writeFileSync(path.resolve(__dirname, dir, 'Component.js'), output.code);
    console.log ('Compiled: ' + dir);
});