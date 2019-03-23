var http = require('http');
var url = require('url');
var querystring = require('querystring');
var static = require('node-static');

var fileServer = new static.Server('.');

var users = {};

function onSubscribe(req, res) {
  var id = Math.random();

  res.setHeader('Content-Type', 'text/plain;charset=utf-8');
  res.setHeader("Cache-Control", "no-cache, must-revalidate");

  users[id] = res;

  req.on('close', function() {
    delete users[id];
  });

}


function server_change(message) {

  for (var id in users) {
    var res = users[id];
    res.end(message);
  }

  users = {};
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
      console.log(chunk);
      message += chunk;
    }).on('end', function() {
      server_change(message);
      res.end("ok");
    });
    return;
  }
  fileServer.serve(req, res);
}


if (!module.parent) {
  http.createServer(accept).listen(8000);
  console.log('Сервер запущен на порту 8000');
} else {
  exports.accept = accept;

  process.on('SIGINT', function() {
    for (var id in users) {
      var res = users[id];
      res.end();
    }
  });
}
