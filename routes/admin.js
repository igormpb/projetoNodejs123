require("../models/postagem")
require("../models/Categoria")
const {eAdmin} = require('../helpers/eAdmin');

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Categoria = mongoose.model("categorias");
const Postagem = mongoose.model("postagens") 
router.get('/', eAdmin,function (req, res) {
    res.render('admin/index')
})
router.get('/categorias',eAdmin, (req, res) => {
    Categoria.find().sort({ date: 'desc' }).then((categorias) => {
        res.render('admin/categoria', { categorias: categorias });
    }).catch((err) => {
        res.redirect('/admin')
    })

})
router.get('/categoria/add',eAdmin, (req, res) => {
    res.render('admin/addCategoria')
})

router.get('/posts',eAdmin, function (req, res) {
    res.render('posts')
})

router.post('/categorias/nova',eAdmin, function (req, res) {

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
        res.render('admin/addCategorias', { erros: erros });
    }


    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }
    new Categoria(novaCategoria).save().then(() => {
        req.flash('success_msg', "categoria criada com successo!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash('error_msg', 'houve um erro! Tenta novamente')
        res.redirect("/admin/categorias")
    })

})
router.get('/categorias/edit/:id', eAdmin,(req, res) => {
    Categoria.findOne({ _id: req.params.id }).then((categoria) => {
        res.render("admin/editcategoria", { categoria: categoria })
    }).catch((err) => {
        req.flash("error_msg", 'Não foi possivel achar essa categoria');
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/edit',eAdmin, (req, res) => {

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
        categoria.date = new Date

        categoria.save().then(() => {
            req.flash('success_msg', 'Categoria editada com sucesso!')
            res.redirect('/admin/categorias');
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao editar a categoria!');
            res.redirect('/admin/categorias')
        })
    }).catch((err) => {
        req.flash('error_msg', 'houve um error!')
        res.redirect('/admin/categorias');
    })}

})
router.post('/categoria/deletar',eAdmin,(req,res)=>{
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash('success_msg','deletado com sucesso!');
        res.redirect('/admin/categorias')
    }).catch((err)=>{
        req.flash('error_msg','error ao deletar')
        res.redirect('/admin/categorias')
    })
})

router.get('/postagens',eAdmin,(req,res)=>{
    Postagem.find().populate('categoria').sort({data:"desc"}).then((postagens)=>{
        res.render('admin/postagens',{postagens: postagens});
    }).catch((err)=>{
        req.flash('error_msg','houver um error ao postar')
        res.render('admin/postagens')
    })
})

router.get('/postagem/add',eAdmin,(req,res)=>{
    Categoria.find().then((categorias)=>{
        res.render('admin/addpostagem',{categorias: categorias})
    }).catch((err)=>{
        req.flash('error_msg','error')
        res.redirect('/admin')
    })
    
})
router.post('/postagens/nova',eAdmin,(req,res)=>{
    
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
router.post('/postagem/deletar',eAdmin,(req,res)=>{
    Postagem.remove({_id: req.body.id}).then(()=>{
        req.flash('success_msg','deletado com sucesso!');
        res.redirect('/admin/postagens')
    }).catch((err)=>{
        req.flash('error_msg','error ao deletar')
        res.redirect('/admin/postagens')
    })
})
router.get('/postagem/edit/:id', eAdmin,(req, res) => {
    
    Postagem.findOne({ _id: req.params.id }).then((postagem) => {
        Categoria.find().then((categorias)=>{
            res.render("admin/editpostagem", {categorias: categorias, postagem: postagem })
        })
    }).catch((err) => {
        req.flash("error_msg", 'Não foi possivel achar essa categoria');
        res.redirect('/admin/postagem')
    })
})
router.post('/postagem/edit', eAdmin,(req,res)=>{
    
    Postagem.findOne({_id: req.body.id}).then((postagem)=>{
        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria
        postagem.data = new Date
        

        postagem.save().then(()=>{
            req.flash('success_msg','Postagem editada com sucesso!')
            res.redirect('/admin/postagens')
        }).catch((err)=>{
            req.flash('error_msg','erro ao editar')
            res.redirect('/admin/postagens')
        })
        
    })

})

module.exports = router;