require('../models/usuario');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bycrypt = require('bcryptjs')
const Usuario = mongoose.model('usuarios');


//
router.get('/registro',(req,res)=>{
    res.render('usuarios/registro');
})

router.post('/registro',(req,res)=>{

    var erros =[];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto:"Nome inválido"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto:"Email inválido"})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto:"Senha inválido"})
    }
    if(req.body.senha.length < 4){
        erros.push({texto:'Senha insuficiente'})
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto: 'As senhas são diferentes'});
    }
    if(erros.length > 0){
        res.render('usuarios/registro',{erros: erros});

    }else{

        Usuario.findOne({email: req.body.email}).then((usuario)=>{
            if(usuario){
            req.flash('error_msg','O e-mail já esta sendo utilizado')
            res.redirect('/usuarios/registro')
        }else{
            const novoUsuario= new Usuario({
                nome:req.body.nome,
                email:req.body.email,
                senha:req.body.senha
            })
            bycrypt.genSalt(10,(erro,salt)=>{
                bycrypt.hash(novoUsuario.senha,salt,(erro,hash)=>{
                    if(erro){
                        req.flash('error_msg','houve um erro ao cadastrar o usuário')
                        res.redirect('/')
                    }else{
                        novoUsuario.senha = hash

                        novoUsuario.save().then(()=>{
                            req.flash('success_msg','Usuário cadastrado com sucesso!')
                            res.redirect('/')
                        }).catch((err)=>{
                            console.log(err)
                            req.flash('error_msg','houve um tipo de erro')
                            res.redirect('/')
                            
                        })
                    }
                })
            })
            
        }

        }).catch((err)=>{
            req.flash('error_msg','houve um tipo de erro!')
            res.redirect('/')
        })


    }
})

module.exports = router