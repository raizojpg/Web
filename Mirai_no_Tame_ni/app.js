const path = require('path');
const formidable = require('formidable');
const session = require('express-session'); 
const fs = require('fs');
const express = require('express');
var app = express();

app.use(session({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: false 
    }));


app.listen(3000);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
  console.log(path.join(__dirname, 'styles'));
  res.sendFile('./views/login.html', { root: __dirname });
});

app.post('/login', function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
       user =  verifica(fields.username, fields.password);
       if(user){
         req.session.username = user; 
         res.redirect('/logged'); }
       else
         req.session.username = false;
  });
});


app.get('/logged', (req, res) => {
  res.sendFile('./views/index.html', { root: __dirname });
});

app.get('/index.html', (req, res) => {
  res.redirect('/logged');
});

app.get('/tokyo.html', (req, res) => {
  res.sendFile('./views/tokyo.html', { root: __dirname });
});

app.get('/osaka.html', (req, res) => {
  res.sendFile('./views/osaka.html', { root: __dirname });
});

app.get('/kyoto.html', (req, res) => {
  res.sendFile('./views/kyoto.html', { root: __dirname });
});

app.get('/sapporo.html', (req, res) => {
  res.sendFile('./views/sapporo.html', { root: __dirname });
});

app.post('/tokyo.html', (req, res) => {
  res.redirect('/tokyo.html');
});

app.post('/osaka.html', (req, res) => {
  res.redirect('/osaka.html');
});

app.post('/kyoto.html', (req, res) => {
  res.redirect('/kyoto.html');
});

app.post('/sapporo.html', (req, res) => {
  res.redirect('/sapporo.html');
});

app.get('/form.html', (req, res) => {
  res.sendFile('./views/form.html', { root: __dirname });
});

app.get('/logout', function(req, res) {
  req.session.destroy(); 
  res.redirect('/');
}); 

app.get('/session-data', (req, res) => {
  const sessionData = req.session;
  res.json(sessionData);
  res.redirect('/logged');
});

app.post('/users.json', (req, res) => {
  if (fs.existsSync("users.json")){
    let data = fs.readFileSync("./users.json");
    let ob = JSON.parse(data);
    for(let i=0;i<ob.length;i++){
        if(ob[i].username == req.session.username){
          ob[i].forms.push(req.body);
          res.end("ok");
        }
    }
    fs.writeFileSync("./users.json",JSON.stringify(ob));
  }
});

app.get('/users.json', (req, res) => {
  if (fs.existsSync("users.json")){
    let data = fs.readFileSync("./users.json");
    let ob = JSON.parse(data);
    for(let i=0;i<ob.length;i++){
        if(ob[i].username == req.session.username){
          res.json(ob[i]);
          //res.end(JSON.stringify(ob[i]));
        }
    }
  }
});

app.use((req, res) => {
  res.status(404).sendFile('./views/404.html', { root: __dirname });
});

function verifica(username, password){
  if (fs.existsSync("users.json")){
      let data = fs.readFileSync("./users.json");
      let ob = JSON.parse(data);
      for(let i=0;i<ob.length;i++){
          if(ob[i].username==username && ob[i].password==password){
              return username;
          }
      }
      return false;
  }
}