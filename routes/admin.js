const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require("../models/Categoria")
const Categoria = mongoose.model("categorias");
require("../models/postagem")
const Postagem = mongoose.model("postagens") 
router.get('/', function (req, res) {
    res.render('admin/index')
})
router.get('/categoria', (req, res) => {
    Categoria.find().sort({ date: 'desc' }).then((categorias) => {
        res.render('admin/categoria', { categorias: categorias });
    }).catch((err) => {
        res.redirect('/admin')
    })

})
router.get('/categoria/add', (req, res) => {
    res.render('admin/addCategoria')
})

router.get('/posts', function (req, res) {
    res.render('posts')
})

router.post('/categorias/nova', function (req, res) {

    var erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: 'Nome inválido' })
    }
    if (req.body.nome.length < 2) {
        erros.push({ texto: 'Nome com caracteres insuficiênte' })
    }


    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: 'Slug inválido' })
    }

    if (erros.length > 0) {
        res.render('admin/addCategoria', { erros: erros });
    }


    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }
    new Categoria(novaCategoria).save().then(() => {
        req.flash('success_msg', "categoria criada com successo!")
        res.redirect("/admin/categoria")
    }).catch((err) => {
        req.flash('error_msg', 'houve um erro!,Tenta novamente')
        //res.redirect("/admin")
    })

})
router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({ _id: req.params.id }).then((categoria) => {
        res.render("admin/editcategoria", { categoria: categoria })
    }).catch((err) => {
        req.flash("error_msg", 'Não foi possivel achar essa categoria');
        res.redirect('/admin/categoria')
    })
})

router.post('/categorias/edit', (req, res) => {

    var erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: 'Nome inválido' })
    }
    if (req.body.nome.length < 2) {
        erros.push({ texto: 'Nome com caracteres insuficiênte' })
    }


    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: 'Slug inválido' })
    }

    if (erros.length > 0) {
        res.render('admin/editcategoria', { erros: erros });
    }else{

    Categoria.findOne({ _id: req.body.id }).then((categoria) => {

        

        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash('success_msg', 'Categoria editada com sucesso!')
            res.redirect('/admin/categoria');
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao editar a categoria!');
            res.redirect('/admin/categoria')
        })
    }).catch((err) => {
        req.flash('error_msg', 'houve um error!')
        res.redirect('/admin/categoria');
    })}

})
router.post('/categoria/deletar',(req,res)=>{
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash('success_msg','deletado com sucesso!');
        res.redirect('/admin/categoria')
    }).catch((err)=>{
        req.flash('error_msg','error ao deletar')
        res.redirect('/admin/categoria')
    })
})

router.get('/postagens',(req,res)=>{
    Postagem.find().populate('categoria').sort({data:"desc"}).then((postagens)=>{
        res.render('admin/postagens',{postagens: postagens});
    }).catch((err)=>{
        req.flash('error_msg','houver um error ao postar')
        res.render('/admin')
    })
})

router.get('/postagem/add',(req,res)=>{
    Categoria.find().then((categorias)=>{
        res.render('admin/addpostagem',{categorias: categorias})
    }).catch((err)=>{
        req.flash('error_msg','error')
        res.redirect('/admin')
    })
    
})
router.post('/postagens/nova',(req,res)=>{
    
    var erros = [];

    if(req.body.categoria == 0){
        erros.push({texto:'categoria inválida, registre uma categoria'})
    }
    if(erros.length > 0 ){
        res.render('/admin/addpostagem',{erros: erros})
    }else{
        const novaPostagem = {
            titulo:req.body.titulo,
            descricao:req.body.descricao,
            slug: req.body.slug,
            conteudo:req.body.conteudo,
            categoria:req.body.categoria
        }
        new Postagem(novaPostagem).save().then(()=>{
            req.flash('success_msg','A postagem foi um sucesso!')
            res.redirect('/admin/postagens')
        }).catch((err)=>{
            req.flash('error_msg','Erro ao criar uma postagem')
            res.redirect('/admin/postagem/add')
            
        })
    }
})
router.post('/postagem/deletar',(req,res)=>{
    Postagem.remove({_id: req.body.id}).then(()=>{
        req.flash('success_msg','deletado com sucesso!');
        res.redirect('/admin/postagens')
    }).catch((err)=>{
        req.flash('error_msg','error ao deletar')
        res.redirect('/admin/postagens')
    })
})

module.exports = router;