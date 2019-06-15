/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.
**************************************************************/
var fs = require('fs');
var storage;

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var handleFile = function(err, data) {
  if (err) {
    throw err;
  }
  storage = JSON.parse(data);
};

var requestHandler = function(request, response) {
  console.log(
    'Serving request type ' + request.method + ' for url ' + request.url
  );

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/JSON';

  if (!request.url.includes('classes/messages')) {
    response.writeHead(404, headers);
    response.end();
  } else {
    //have to stringify
    if (request.method === 'GET') {
      response.writeHead(200, headers);
      fs.readFile('./server/storage.JSON', handleFile);
      response.end(JSON.stringify(storage));
    } else if (request.method === 'POST') {
      var newMsg = [];
      request
        .on('data', chunk => {
          newMsg.push(chunk);
          newMsg = JSON.parse(Buffer.concat(newMsg).toString());
        })
        .on('end', () => {
          response.writeHead(200, headers);
          fs.readFile('./server/storage.JSON', function(err, data) {
            if (err) {
              throw err;
            }
            storage = JSON.parse(data);
            response.end(JSON.stringify(storage));
            storage.results.push(newMsg);

            fs.writeFile(
              './server/storage.JSON',
              JSON.stringify(storage),
              function(err) {
                if (err) {
                  throw err;
                }
                console.log('Saved!');
              }
            );
          });
        });
    } else if (request.method === 'OPTIONS') {
      response.writeHead(200, headers);
      response.end();
    }
  }
};

exports.requestHandler = requestHandler;
