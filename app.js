const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const admin = require('./routes/admin');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
require('./models/postagem');
const Postagem = mongoose.model('postagens')
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

app.get('/',(req,res)=>{
    Postagem.find().populate('categoria').sort({data : 'desc'}).then((postagens)=>{
        res.render('index',{postagens: postagens})
    }).catch((err)=>{
        req.flash('error_msg','erro!')
    })
})

app.get('/postagem/:slug',(req,res)=>{
    Postagem.findOne({slug:req.params.slug}).then((postagens)=>{
        if(Postagem){
            res.render('postagem/index',{postagens: postagens});
        }else{
           req.flash('error_msg','Não foi possivel carregar está pagina')
           res.redirect('/')
        }
    }).catch((err)=>{
        req.flash('error_msg','error!!')
        res.redirect('/')
    })
})
 app.use('/admin', admin);



// servidor
app.listen(8080, () => {
    console.log('open server!');
});