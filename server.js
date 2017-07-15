var static = require('node-static');

//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('.',  { cache: 7200 });

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(8889);

console.log("Static file server running at\n  => http://localhost:8889 /\nCTRL + C to shutdown");