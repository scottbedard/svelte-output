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

    // compile the component to an umd & es modules
    const umdOutput = svelte.compile(source, {
        name: 'Component',
        format: 'umd',
    });

    const esmOutput = svelte.compile(source, {
        name: 'Component',
        format: 'es',
    });
    
    // save the resulting code
    fs.writeFileSync(path.resolve(__dirname, dir, 'Component.js'), umdOutput.code);
    fs.writeFileSync(path.resolve(__dirname, dir, 'Component.esm.js'), esmOutput.code);

    // create a simple example page
    fs.writeFileSync(path.resolve(__dirname, dir, 'index.html'), `
        <!doctype html>
        <html>
            <body>
                <h1><a href="file://${dir}">${dir}</a></h1>

                <ul>
                    <li><a href="file:///C:/git/svelte-output/components">Components</a></li>
                    <li><a href="./Component.esm.js">View compiled code</a></li>
                </ul>

                <hr />

                <div id="component"></div>

                <script type="text/javascript" src="./Component.js"></script>

                <script type="text/javascript">
                    new Component({
                        target: document.querySelector('#component'),
                    });
                </script>
            </body>
        </html>
    `);

    // and finally, provide some feedback that we're done
    console.log ('Compiled: ' + dir);
});