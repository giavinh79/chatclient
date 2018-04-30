const app = require('express')(); //dependencies and modules
const http = require('http').Server(app);
const io = require('socket.io')(http, { wsEngine: 'ws' });
const fs = require('fs'); // bring in the file system api
const mustache = require('mustache'); //{{}}
const MongoClient = require('mongodb').MongoClient;
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
  .get('/loadingPhilCoffman.gif', function(req, res) {
    res.sendFile(__dirname + "/loadingPhilCoffman.gif");
  })
  .get('/favicon.ico', function(req, res) {
    res.sendFile(__dirname + "/favicon.ico");
  });

const bodyParser = require('body-parser'); // Necessary to get form data with Express
app.use(bodyParser.urlencoded({ extended: true }));

var url = "mongodb://default:chatpassword123@ds127129.mlab.com:27129/chatclient";
app.post('/database', function(req, res) {
  // var url = "mongodb://default:chatpassword123@ds127129.mlab.com:27129/chatclient";
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("chatclient");
    var query = { user: req.body.user };
    console.log("Attempting login...");
    dbo.collection("accounts").find(query).toArray(function(err, result) {
      if (err) throw err;
      if (result == null || result == "") {
        console.log("Incorrect credentials");
        var fail = {
          message: "Incorrect credentials!"
        };
        fs.readFile(__dirname + '/index.html', 'utf8', (err, data) => {
          if (err) throw err;
          var html = mustache.to_html(data, fail);
          res.send(html);
        });
      } else {
        if (result[0].pass == req.body.pwd) {
          console.log("Successful login");

          var account = {
            accountname: req.body.user
          };

          fs.readFile(__dirname + '/loggedin.html', 'utf8', (err, data) => {
            if (err) throw err;
            var html = mustache.to_html(data, account); //template system used to generate dynamic HTML
            res.send(html);
          });

        } else {
          console.log("Incorrect credentials");
          var fail = {
            message: "Incorrect credentials!"
          };
          fs.readFile(__dirname + '/index.html', 'utf8', (err, data) => {
            if (err) throw err;
            var html = mustache.to_html(data, fail);
            res.send(html);
          });
        }
      }
      db.close();
    });
  });
});

app.post('/signup', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("chatclient");
  
    var query = { user: req.body.username };
    dbo.collection("accounts").find(query).toArray(function(err, result) {
      if (err) throw err;
      if (!(result == null || result == "")) {
        var fails = {
          message: "Account already exists!"
        };
        fs.readFile(__dirname + '/index.html', 'utf8', (err, data) => {
          if (err) throw err;
          var html = mustache.to_html(data, fails);
          db.close();
          res.send(html);
        });
      } else {
        var myobj = { user: req.body.username, pass: req.body.password };
        dbo.collection("accounts").insertOne(myobj, function(err, res) 
        {
          if (err) throw err;
          console.log("1 document inserted.");
        });
        var success = {
          message: "Sign up was successful."
        };
        fs.readFile(__dirname + '/index.html', 'utf8', (err, data) => {
          if (err) throw err;
          var html = mustache.to_html(data, success);
          db.close();
          res.send(html);
        });
      }
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