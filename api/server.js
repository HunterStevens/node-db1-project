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

server.get('/:id', validateID, (req,res)=>{
            res.status(200).json(req.user);
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

server.put('/:id', validateID, validateAccount, (req,res)=>{
    db('accounts').where({id:req.params.id}).update(req.body)
    .then(count =>{
        if(count > 0){
            db('accounts').where({id:req.params.id})
                .then(([people]) =>{
                        res.status(200).json({people});
                })
                .catch(err=>{
                    res.status(500).json({error:err});
                })
        }
        else{
            res.status(404).json({message:"invalid ID"});
        }
    })
    .catch(err =>{
        res.status(500).json({error:err});
    })
})

server.delete('/:id', validateID, (req,res) =>{
    db('accounts').where({id:req.params.id}).del()
    .then(count =>{
        if(count > 0){
            db('accounts').where({id:req.params.id})
                .then(([people]) =>{
                        res.status(200).json({people});
                })
                .catch(err=>{
                    res.status(500).json({error:err});
                })
        }
        else{
            res.status(404).json({message:"invalid ID"});
        }
    })
    .catch(err =>{
        res.status(500).json({error:err});
    })
})

function validateAccount(req,res,next){
    const {name, budget} = req.body;
    if(!name || !budget || name==='' || budget === null){
        res.status(404).json({error:"Require Name and Budget (higher than 0)"});
    }else{
        next();
    }
}

function validateID(req,res,next){
    db('accounts').where({id:req.params.id})
    .then(([people]) =>{
        if(people){
            req.user = people;
            next();
        }else{
            res.status(404).json({error:"that account with the id does not exist in the Database."});
        }
    })
    .catch(err=>{
        res.status(500).json({error:err});
    })
}

module.exports = server;
