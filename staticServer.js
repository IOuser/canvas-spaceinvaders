'use strict';

let nodeStatic = require('node-static');
let file = new nodeStatic.Server('./', { gzip: true });

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(3000);