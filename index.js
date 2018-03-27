// var app = require('express')(); //dependencies/modules needed
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
// var clientCount = 0;

const app = require('express')(); //dependencies and modules
const http = require('http').Server(app);
const io = require('socket.io')(http);
var clientCount = 0;

// app.get('/', function(req, res) {
//   res.sendFile(__dirname + '/index.html');
//   // res.sendFile(INDEX);
// });

const PORT = process.env.PORT || 8080; 
//process.env.PORT: convention for Heroku -> if nothing in environ. var then port is 8080

app
  // .get((req, res) => res.sendFile(__dirname + "/index.html"))
  .get('/', function(req, res) {
      res.sendFile(__dirname + '/index.html');
    //   // res.sendFile(INDEX);
  })
  .get('/backgroundWhite.jpg', function(req, res) {
      res.sendFile(__dirname + "/backgroundWhite.jpg");
  })
  .get('/style.css', function(req, res) {
      res.sendFile(__dirname + "/style.css");
  })
  .get('/loggedin.html', function(req, res) {
    res.sendFile(__dirname + "/loggedin.html");
  })
  .get('/loginstyle.css', function(req, res) {
    res.sendFile(__dirname + "/loginstyle.css");
  })
  .get('/favicon.ico', function(req, res) {
    res.sendFile(__dirname + "/favicon.ico");
  });
  //.listen(PORT, () => console.log(`Listening on ${ PORT }`));

// app.get('/backgroundWhite.jpg', function(req, res) {
//   res.sendFile(__dirname + "/backgroundWhite.jpg");
// });

// app.get('/style.css', function(req, res) {
//   res.sendFile(__dirname + "/style.css");
// });

// .listen(8080, () => console.log(`Listening on localhost:8080`));

// const express = require('express');
// const socketIO = require('socket.io');
// const path = require('path');

// const PORT = process.env.PORT || 3000;
// const INDEX = path.join(__dirname, 'index.html');

// const server = express()
//   .use((req, res) => res.sendFile(INDEX))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`));

// app.get('/favicon.ico', function(req, res) {
//   res.sendFile(__dirname + "/" + "favicon.ico");
// });

// app.get('/backgroundWhite.jpg', function(req, res) {
//   res.sendFile(__dirname + "/" + "backgroundWhite.jpg");
// });

// app.get('/style.css', function(req, res) {
//   res.sendFile(__dirname + "/" + "style.css");
// });

// app.get('/loginstyle.css', function(req, res) {
//   res.sendFile(__dirname + "/" + "loginstyle.css");
// });

// app.get('/loggedin.html', function(req, res) {
//   res.sendFile(__dirname + "/" + "loggedin.html");
// });

// app.get('/style.css', function(req, res) {
//   res.sendFile(__dirname + '/style.css');
// });

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

// http.listen(8080, function(){
//   console.log('listening on localhost:8080');
// });

http.listen(PORT, function(){
  console.log('listening on localhost:8080');
});

// const express = require('express');
// const socketIO = require('socket.io');
// const path = require('path');

// const PORT = process.env.PORT || 3000;

// const server = express()
//   .use((req, res) => res.sendFile(__dirname + "/generic.html") )
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`));

// const io = socketIO(server);

// setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

// const app = require('express')(); //dependencies/modules needed
// const http = require('http').Server(app);
// const io = require('socket.io')(http);
// var clientCount = 0;

// http.listen(3000, function(){
//   console.log('listening on localhost:3000');
// });
