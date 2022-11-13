
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const app = express();
const Port = process.env.PORT;

app.use(express.json());   
app.use(express.static('public'));
app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret: process.env.SECRETPASS,
    resave: false,
    saveUninitialized: false,
    
  }));
  app.use(passport.initialize());
  app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true });


const usersSchema = new mongoose.Schema({
    email: String,
    password: String
});


usersSchema.plugin(passportLocalMongoose);


const User = new mongoose.model('User', usersSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res)=>{
    res.render('home')
} );


app
.get('/login', (req, res)=>{
    res.render('login')
})


app.post("/login",passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
    failureMessage: true,
})


);


app
.get('/register', (req, res)=>{
    res.render('register')
} )

.post('/register', async (req, res)=>{
User.register({username: req.body.username}, req.body.password, (err, user)=>{
    if(err){
        console.log(err)
        res.redirect('/register')
    } else{
        passport.authenticate('local') (req, res, ()=>{
            res.redirect('/secrets')
        })

    }
})
});


app.get("/secrets", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("secrets");
    }
    else {
        res.redirect("/login");
    }
});



app.get("/logout", (req,res, next)=>{
    req.logOut((err)=>{
        if(err){ return next(err)}
    });
 
    res.redirect("/");
})



app.listen(Port, ()=>{
    console.log(`Server on on port ${Port}, http://localhost:${Port}`)
});
