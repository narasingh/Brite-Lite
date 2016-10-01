var express = require('express');
var app = express();
var server = require('http').createServer(app);
var logfmt = require('logfmt');
//var WebSocketServer = require('ws').Server;
var io = require('socket.io', {rememberTransport: false}).listen(server);

//static server
var port = Number(process.env.PORT || 3000);
var server_ip_address = process.env.IP || '0.0.0.0';
server.listen(port, server_ip_address, function() {
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
io.sockets.on('connection', function(socket) {
  socket.on('onColorSelect', function(data){
    console.log('Midi data ' + data);
    io.sockets.emit('color', data);
  });
});
