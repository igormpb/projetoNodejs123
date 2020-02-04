const express = require('express');

const bodyParser = require('body-parser');
const mysql = require('mysql');
const handlebars = require('express-handlebars');
const app = express();
const urlencodeParser = bodyParser.urlencoded({extended:false});
const sql = mysql.createConnection({    
    host:'localhost',
    user:'root',
    password:'',
    port:'3306'
});
sql.query("use nodejs");



app.engine("handlebars",handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/',function(req,res){
    res.render('index')
})

app.get("/javascript", function(req,res){
    res.sendFile(__dirname + '/js/javascript.js')
})
app.get("/style", function(req,res){
    res.sendFile(__dirname + '/css/style.css')
})

app.get("/insert", function(req,res){
    res.render('insert')
})

app.post('/controll',urlencodeParser,function(req,res){
    
    sql.query('insert into user values(?,?,?)',[req.body.id,req.body.name,req.body.age]);
    res.render("controll")

    
})
app.get('/select',urlencodeParser,function(req,res){
    sql.query('select *from user whrere("id","name","age")')
})

// start server
app.listen(3003, function(req,res){
    console.log('servidor funcionando!')
    
})