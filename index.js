const PORT = process.env.PORT || 3000; //necessary for Heroku deployment?
const INDEX = path.join(__dirname, 'index.html');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clientCount = 0;

app.get('/', function(req, res) {
  //res.sendFile(__dirname + '/index.html');
  res.sendFile(INDEX);
});

// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: true }));

// app.post('/database', function(req, res) {
//   console.log('rip');
//   res.sendFile(__dirname + '/index.html');
//   //alert("hello");
//  // console.log('You sent the name "' + req.body.user + '".');
//   // res.send(req.body.user);
//   //res.send
// });

io.on('connection', function(socket){
    clientCount++;
    io.emit('client update', clientCount);
    socket.emit('anonymous name', clientCount);

    socket.on('disconnect', function(){
        clientCount--;
        io.emit('client update', clientCount);
    });

    socket.on('chat message', function(msg){
       io.emit('chat message', msg); //for everyone
    });
});

http.listen(3000, function(){
  console.log('listening on localhost:3000');
});

// const express = require('express');
// const socketIO = require('socket.io');
// const path = require('path');

// const PORT = process.env.PORT || 3000;
// const INDEX = path.join(__dirname, 'generic.html');

// const server = express()
//   .use((req, res) => res.sendFile(INDEX) )
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`));

// const io = socketIO(server);

// io.on('connection', (socket) => {
//   console.log('Client connected');
//   socket.on('disconnect', () => console.log('Client disconnected'));
// });

// setInterval(() => io.emit('time', new Date().toTimeString()), 1000);