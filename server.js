var express = 	require('express');
var app = 		express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var mongojs = 		require('mongojs');
var uri 	= 		"mongodb://samarth:abc@ds034348.mongolab.com:34348/mydb";
var db		= 		mongojs.connect(uri, ["contactlist"]);
var contactlist = require('./routes/contactlist');

app.use(cookieParser());
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session(
	{
		secret: 'hehehehe',
		resave: true,
		saveUninitialized: false
	}));

app.use('/js', express.static(__dirname + '/js'));
app.use('/contactlist', contactlist);

var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({passReqToCallback : true}, function(req, username, password, done){
		
		if(username === 'admin' && password === 'admin') {
			return done(null, {username : 'admin'});
		}

		return done(null, false, req.flash('loginMessage', 'Oops! Wrong username or password.'));
	}));

passport.serializeUser(function(user, done){
	done(null, user.username);
});

passport.deserializeUser(function(username, done){
	done(null, {username: username});
});


app.use(passport.initialize());
app.use(passport.session());

app.set('view engine','ejs');


app.post('/', passport.authenticate('local', {
	failureRedirect: '/',
	successRedirect: '/index',
	failureFlash: true
}), function (req,res){

});


app.get('/index', function(req, res){
	if(req.session.passport.user === undefined)
	{
		console.log("undefined user")
		res.redirect('/');
	}
	else
	{
		console.log(req.session.passport.user+" signed in!")
		res.render('index', {username: req.session.passport.user});
	}
});

app.get('/', function(req, res){
	console.log("GET for login");
	res.render('login', { message: req.flash('loginMessage') });
	console.log(req.flash)
});


/////////////////////////////////////////////////////////////////////////////////////
/////contactlist routes///////////////////////////////////


////////////////////////////////////////////////////////

app.listen(process.env.PORT || 1337, function(){
	console.log("Listening on Port...");
})