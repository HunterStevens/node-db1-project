const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

server.get('/', (req,res)=>{
    db('accounts')
    .then(people =>{
        res.status(200).json(people);
    })
    .catch(err=>{
        res.status(500).json({error:err});
    })
})

server.get('/:id', (req,res)=>{
    db('accounts').where({id:req.params.id})
    .then(([people]) =>{
        if(people){
            res.status(200).json(people);
        }else{
            res.status(404).json({error:"that account with the id does not exist in the Database."});
        }
    })
    .catch(err=>{
        res.status(500).json({error:err});
    })
})

server.post('/', validateAccount, (req,res)=>{
    db('accounts').insert(req.body)
    .then(newAccount =>{
        res.status(200).json({accounts:newAccount});
    })
    .catch(err =>{
        res.status(500).json({message:err});
    })
})

function validateAccount(req,res,next){
    const {name, budget} = req.body;
    if(!name || !budget || name==='' || budget === null){
        res.status(404).json({error:"Require"});
    }else{
        next();
    }
}

module.exports = server;
