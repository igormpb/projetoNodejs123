const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const admin = require('./routes/admin');
const path = require('path');
const app = express();


// template engine 
app.engine('handlebars',handlebars({defaultLayout: 'main'}));
app.set('view engine','handlebars');
//

//body parser 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//public 
app.use(express.static(path.join(__dirname + 'public')));

// rotas
app.use('/admin', admin);



// servidor
app.listen(8081,()=>{
    console.log('open server!')
})