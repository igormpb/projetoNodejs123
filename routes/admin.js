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
    const novaCategoria = {
        nome: req.body.nome,
        slug:req.body.slug
    }
   new Categoria(novaCategoria).save().then(()=>{
       console.log('registrado!')
   }).catch((err)=>{
       console.log(`houve um erro ${err}`)
   })
})

module.exports = router;