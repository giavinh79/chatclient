
/*
var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res){ //request, response
  //res.send('<h1>Hello world</h1>');
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
*/

//with socket.io library
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clientCount = 0;

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/generic.html');
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// app.post('/database', function(req, res) {
//   console.log('rip');
//   res.sendFile(__dirname + '/index.html');
//   //alert("hello");
//  // console.log('You sent the name "' + req.body.user + '".');
//   // res.send(req.body.user);
//   //res.send
// });

io.on('connection', function(socket){
  //console.log('a user connected');
  /*
  */
    //console.log('a user connected');
    // socket.broadcast.emit('New user has connected');
    clientCount++;
    // io.emit('client update', "clientCount");
    io.emit('client update', clientCount);
    socket.emit('anonymous name', clientCount);

    socket.on('disconnect', function(){
        //console.log('user disconnected');
        clientCount--;
        io.emit('client update', clientCount);
        // io.emit('client update', clientCount);
    });

    socket.on('chat message', function(msg){
       // console.log('message: ' + msg);
       //io.emit('some event', { for: 'everyone' });
       io.emit('chat message', msg); //for everyone
    });
});

http.listen(8080, function(){
  console.log('listening on localhost:8080');
});