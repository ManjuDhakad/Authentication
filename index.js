const express = require('express');
const app = express();
const session = require('express-session');

// part 1
app.set('view engine' , 'ejs');

app.use(session({
    resave: false,
    saveUninitialized : true,
    secret: 'SECRET'
}));

app.get('/' , function(req, res){
    res.render('pages/auth');
})

const port = process.env.PORT || 8080;
app.listen(port , () => console.log('App is lisning on port' + port));


// part 2
const passport = require('passport');
var  userProfile;
app.use(passport.initialize());
app.use(passport.session());

app.get('/contact' , (req, res) => res.render('pages/contact'));
app.get('/error' , (req,res) => res.send("error logging in"));
app.get('/analytics' , (req,res) => res.send("Analytics page"));

passport.serializeUser(function(user , cb){
    cb(null , user);
});

passport.deserializeUser(function(obj , cb){
    cb(null , obj);
});


// part 3

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '163383098507-de7osm0jcc6bpetkg8kkbui872s6gsff.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'xEavLZsywuYWLtavlEZ0cdLl';

passport.use(new GoogleStrategy({
        clientID : GOOGLE_CLIENT_ID,
        clientSecret : GOOGLE_CLIENT_SECRET,
        callbackURL : "http://localhost:8080/auth/google/callback" 
    },
    function(accessToken , refreshToken , profile , done){
        userProfile = profile;
        return done(null , userProfile);
    }   
));

app.get('/auth/google', 
    passport.authenticate('google' , {scope: ['profile' , 'email']}));

app.get('/auth/google/callback' , 
    passport.authenticate('google' , {failureRedirect: '/error'}),
    function(req , res){
        res.redirect('/contact');
});


// part 4

app.post('/analytics', function(req,res){
    res.render('/analytics');
});






