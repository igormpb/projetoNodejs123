const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const admin = require('./routes/admin');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();

//sessao
app.use(session({
    secret:'cursodenode',
    resave:true,
    saveUninitialized:true
}));
app.use(flash())
//midlewares
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next()
});
//mongoose
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/blogapp",{ useNewUrlParser: true,useUnifiedTopology: true }).then(() => {
    console.log("servidor rodando")
}).catch((err) => {
    console.log(err)
});
// template engine 
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
//body parser 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//public 
app.use(express.static(path.join(__dirname, 'public')));
// rotas
app.use('/admin', admin);



// servidor
app.listen(3000, () => {
    console.log('open server!');
});