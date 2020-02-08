const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require("../models/Categoria")
const Categoria =  mongoose.model("categorias");

router.get('/',function(req,res){
    res.render('admin/index')
})
router.get('/categoria',(req,res)=>{
    res.render('admin/categoria')
})
router.get('/categoria/add',(req,res)=>{
    res.render('admin/addCategoria')
})

router.get('/posts',function(req,res){
    res.render('posts')
})

router.post('/categorias/nova',function(req,res){
   
    var erros = [];
    
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome ==null){
        erros.push({texto:'Nome inválido'})
    }
    if(req.body.nome.length < 2){
        erros.push({texto: 'Preenche Mais'})
    }
    
    
        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug ==null){
        erros.push({texto:'slug inválido'})
    }

    if(erros.length >0){
        res.render('admin/addCategoria',{erros: erros});
    }
   
   
    const novaCategoria = {
        nome: req.body.nome,
        slug:req.body.slug
    }
   new Categoria(novaCategoria).save().then(()=>{
    req.flash('success_msg',"categoria criada com successo!")   
        res.redirect("/admin/categoria")
   }).catch((err)=>{
       req.flash('error_msg','houve um erro!,Tenta novamente')
       res.redirect("/admin")
   })
})

module.exports = router;