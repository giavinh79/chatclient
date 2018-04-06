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
  var url = "mongodb://defaultUser:chatpassword123@ds127129.mlab.com:27129/chatclient";

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database connection successful!");
    db.close();
  });
});

app.post('/signup', function(req, res) {
  console.log(req.body.username);
  console.log(req.body.password);

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://defaultUser:chatpassword123@ds127129.mlab.com:27129/chatclient";

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("chatclient");
    var myobj = { user: req.body.username, pass: req.body.password };
    dbo.collection("accounts").insertOne(myobj, function(err, res) {
     if (err) throw err;
     console.log("1 document inserted.");
     db.close();
    });
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
       io.emit('chat message', msg); //for everyone
    });
});

http.listen(PORT, function(){
  console.log('listening on localhost:8080');
});