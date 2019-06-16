/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.
**************************************************************/
var fs = require('fs');
const urlParser = require('url');
var storage;
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, application/json',
  'access-control-max-age': 10 // Seconds.
};

var handleError = function(err, data) {
  if (err) {
    throw err;
  }
};
var requestHandler = function(request, response) {
  console.log(
    'Serving request type ' + request.method + ' for url ' + request.url
  );

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/JSON';
  const url = urlParser.parse(request.url).pathname;
  if (url.includes('classes/messages')) {
    if (request.method === 'GET') {
      fs.readFile('./server/storage.JSON', function(err, data) {
        if (err) { throw err; }
        storage = JSON.parse(data);
        sendReponse(response, storage, headers, 200);
      });
    } else if (request.method === 'POST') {
      collectData(request, newMsg => {
        newMsg.objectId = Date.now();
        fs.readFile('./server/storage.JSON', function(err, data) {
          if (err) {
            throw err;
          }
          storage = JSON.parse(data);
          storage.results.push(newMsg);

          fs.writeFile(
            './server/storage.JSON',
            JSON.stringify(storage),
            handleError
          );
        });
        sendReponse(response, newMsg, headers, 201);
      });
    } else if (request.method === 'OPTIONS') {
      response.writeHead(200, headers);
      response.end();
    } else {
      sendError(response);
    }
  } else {
    send404(response);
  }
};

var send404 = function(response) {
  response.writeHead(404, { 'Context-Type': 'text/plain' });
  response.end();
};

var sendReponse = function(response, payload, headers = headers, status = 200) {
  if (typeof payload === 'object' && payload !== null) {
    payload = JSON.stringify(payload);
  }
  response.writeHead(status, headers);
  response.end(payload);
};

var collectData = function(request, callback) {
  var newMsg = '';
  request
    .on('data', chunk => {
      newMsg += chunk.toString();
    })
    .on('end', function() {
      var message = JSON.parse(newMsg);
      callback(message);
    });
};
exports.requestHandler = requestHandler;
