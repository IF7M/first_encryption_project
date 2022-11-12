
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');
const app = express();
const Port = process.env.PORT;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser:true});

const usersSchema = new mongoose.Schema({
    email: String,
    password: String
});





const User = new mongoose.model('User', usersSchema);

app.get('/', (req, res)=>{
    res.render('home')
} );


app
.get('/login', (req, res)=>{
    res.render('login')
})
.post('/login', (req, res)=>{
    User.findOne({
        email: req.body.username
    }, (err, found)=>{
        if(err){
            console.log(err)
        } else{
            if(found){
                if(found.password === md5(req.body.password)){
                    res.render('secrets')
                } else{
                    console.log('wrong password!')
                   
                }

            } else{
                console.log('User not found!')
            }

        }

    })

});


app
.get('/register', (req, res)=>{
    res.render('register')
} )
.post('/register', (req, res)=>{
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    })
    newUser.save((err)=>{
        if(!err){
            res.render('secrets')
        } else{
            console.log(err)
        }
    });

    
} );








app.listen(Port, ()=>{
    console.log(`Server on on port ${Port}, http://localhost:${Port}`)
});
