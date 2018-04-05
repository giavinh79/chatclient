const app = require('express')(); //dependencies and modules
const http = require('http').Server(app);
const io = require('socket.io')(http, { wsEngine: 'ws' });
var clientCount = 0;

const PORT = process.env.PORT || 8080; 
//process.env.PORT: convention for Heroku -> if nothing in environ. var then port is 8080

app
  //.get((req, res) => res.sendFile(__dirname + "/index.html"))
  .get('/', function(req, res) {
      res.sendFile(__dirname + '/index.html');
  })
  .get('/backgroundWhite-compressed.jpg', function(req, res) {
      res.sendFile(__dirname + "/backgroundWhite-compressed.jpg");
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

const bodyParser = require('body-parser'); // Necessary to get form data with Express
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/database', function(req, res) {
  console.log(req.body.user);
  console.log(req.body.pwd);

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://root:magma3@ds127129.mlab.com:27129/chatclient";

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database connection successful!");
    db.close();
  });
});

app.post('/account', function(req, res) {
  console.log(req.body.username);
  console.log(req.body.password);

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://root:magma3@ds127129.mlab.com:27129/chatclient";

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database connection successful!");
    db.close();
  });
});

io.on('connection', function(socket){
    clientCount++;
    io.emit('client update', clientCount);
    socket.emit('anonymous name', clientCount);

    socket.on('disconnect', function(){
        clientCount--;
        io.emit('client update', clientCount);
    });

    socket.on('chat message', function(msg){
      //  if (msg != null)
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
