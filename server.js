var express = 	require('express');
var app = 		express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var mongojs = 		require('mongojs');
var uri 	= 		"mongodb://samarth:abc@ds034348.mongolab.com:34348/mydb";
var db		= 		mongojs.connect(uri, ["contactlist"]);

app.use(cookieParser());
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session(
	{
		secret: 'hehehehe',
		resave: true,
		saveUninitialized: false
	}));

app.use('/js', express.static(__dirname + '/js'));

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

app.get('/contactlist', function(req,res)
{
	console.log('Received a GET request!');

	db.contactlist.find(function(err,docs)
	{
		console.log(docs);
		res.json(docs);
	});	

});

app.get('/contactlist/:id', function(req,res)
{
	var id = req.params.id;
	console.log('Received a GET request for id %s !',id);

	db.contactlist.find({ _id: mongojs.ObjectId(id)}, function(err,doc)
	{
		console.log(doc);
		res.json(doc);
	});	

});

app.post('/contactlist', function(req, res)
{
	db.contactlist.insert(req.body, function(err, doc){

		res.json(doc);

	});
});

app.delete('/contactlist/:id', function(req, res){
	var id = req.params.id;
	console.log("Received a request to delete contact with _id "+ id);
	db.contactlist.remove({_id: mongojs.ObjectId(id)}, function(err, doc){
		res.json(doc);
	});
});

app.put('/contactlist/:id', function(req,res)
{
	var id = req.params.id;
	console.log("Received an Update request contact with _id "+ id);

	db.contactlist.findAndModify( {query: {_id: mongojs.ObjectId(id)},
		update: {$set: {name: req.body.name, email: req.body.email, number: req.body.number}},
		new: true}, function(err, doc){
			res.json(doc);
		});
});

////////////////////////////////////////////////////////

app.listen(process.env.PORT || 1337, function(){
	console.log("Listening on Port...");
})