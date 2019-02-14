var http = require('http');
var url = require('url');
var querystring = require('querystring');
var static = require('node-static');

var fileServer = new static.Server('.');

var clients = {};

function onSubscribe(req, res) {
  var id = Math.random();

  res.setHeader('Content-Type', 'text/plain;charset=utf-8');
  res.setHeader("Cache-Control", "no-cache, must-revalidate");

  clients[id] = res;

  req.on('close', function() {
    delete clients[id];
  });

}


function newChange(message) {

  for (var id in clients) {
    var res = clients[id];
    res.end(message);
  }

  clients = {};
}

function accept(req, res) {
  var urlParsed = url.parse(req.url, true);

  if (urlParsed.pathname == '/subscribe') {
    onSubscribe(req, res);
    return;
  }

  if (urlParsed.pathname == '/publish' && req.method == 'POST') {
    req.setEncoding('utf8');
    var message = '';
    req.on('data', function(chunk) {
      message += chunk;
    }).on('end', function() {
      newChange(message);
      res.end("ok");
    });
    return;
  }
  fileServer.serve(req, res);
}


if (!module.parent) {
  http.createServer(accept).listen(8080);
  console.log('Сервер запущен на порту 8080');
} else {
  exports.accept = accept;

  process.on('SIGINT', function() {
    for (var id in clients) {
      var res = clients[id];
      res.end();
    }
  });
}
