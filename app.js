require('./models/postagem');
require('./models/usuario');
require('./models/Categoria');
const passport = require('passport')
require('./config/auth')(passport);
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const admin = require('./routes/admin');
const usuario = require('./routes/usuario')
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const Usuario = mongoose.model('usuarios')
const Categoria = mongoose.model('categorias')
const Postagem = mongoose.model('postagens')
const app = express();

//sessao
app.use(session({
    secret:'cursodenode',
    resave:true,
    saveUninitialized:true
}));

app.use(passport.initialize())
app.use(passport.session());

app.use(flash())
//midlewares
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
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
app.get('/categorias', (req,res)=>{
    Categoria.find().then((categorias)=>{
    res.render('categoria/categorias',{categorias:categorias})
    }).catch((err)=>{
    req.flash('error_msg','houve um erro ao listar a categoria')
    })
})

app.get('/categorias/:slug',(req,res)=>{
    Categoria.findOne({slug: req.params.slug}).then((categoria)=>{
        if(categoria){
            Postagem.find({categoria:categoria._id}).then((postagens)=>{
        res.render('categoria/postDaCategoria',{postagens: postagens,categoria: categoria})
    }).catch((err)=>{
        req.flash('error_msg','erro ao entrar na postagens da categoria')
        res.redirect('/')
    })
            
        }
    }).catch((err)=>{
        req.flash('error_msg','erro ao entrar na postagens da categoria')
        res.redirect('/')
    })
})
app.use('/admin', admin);
app.use('/usuarios', usuario)


// servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log('open server!');
});