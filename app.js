var express = require('express');
var app = express();
var server = require('http').createServer(app);
var logfmt = require('logfmt');
var WebSocketServer = require('ws').Server;

//static server
var port = Number(process.env.PORT || 3000);
server.listen(port, function() {
  console.log(' listening port ' + port );
});

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.use(logfmt.requestLogger());
app.use('/inc', express.static(__dirname + '/inc'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/soundfont', express.static(__dirname + '/soundfont'));

//websocket server
var wss = new WebSocketServer({ server : server });
console.log('websocket server created');
wss.on('connection', function(ws) {
  ws.on('message', function(data, flags) {
    if (flags.binary) {
      console.log('MIDI data' + data);
      ws.send(data, { binary: true });
    }
  });
  console.log('websocket connection open');
  ws.on('close', function() {
    console.log('websocket connection close');
  });
});
