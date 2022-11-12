
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
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
.post('/login', async (req, res)=>{
 

    User.findOne({
        email: req.body.username
    }, (err, found)=>{
      


        if(err){
            console.log(err)
        } else{
            if(!found){
               console.log('User not found!')
            } else{
                bcrypt.compare(req.body.password, found.password,(err, result)=>{
                    
                if(result=== true){
                    res.render('secrets')
                } else{
                    console.log('wrong password!')
                   
                }
                   
        
                })


            }

        }

    })


});


app
.get('/register', (req, res)=>{
    res.render('register')
} )
.post('/register', async (req, res)=>{
     bcrypt.hash(req.body.password, saltRounds).then ((hash)=>{
        const newUser = new User({
            email: req.body.username,
            password: hash
        })
        newUser.save((err)=>{
            if(!err){
                res.render('secrets')
            } else{
                console.log(err)
            }
        });
    })

       
   

    

    
} );








app.listen(Port, ()=>{
    console.log(`Server on on port ${Port}, http://localhost:${Port}`)
});
