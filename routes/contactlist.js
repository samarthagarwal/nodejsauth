var express = require('express');
var router = express.Router();

var mongojs = 		require('mongojs');
var uri 	= 		"mongodb://samarth:abc@ds034348.mongolab.com:34348/mydb";
var db		= 		mongojs.connect(uri, ["contactlist"]);

router.get('/', function(req,res)
{
	console.log('Received a GET request!');

	db.contactlist.find(function(err,docs)
	{
		console.log(docs);
		res.json(docs);
	});	

});

router.get('/:id', function(req,res)
{
	var id = req.params.id;
	console.log('Received a GET request for id %s !',id);

	db.contactlist.find({ _id: mongojs.ObjectId(id)}, function(err,doc)
	{
		console.log(doc);
		res.json(doc);
	});	

});

router.post('/', function(req, res)
{	
	console.log("POST request for " + req.body);
	db.contactlist.insert(req.body, function(err, doc){

		res.json(doc);

	});
});

router.delete('/:id', function(req, res){
	var id = req.params.id;
	console.log("Received a request to delete contact with _id "+ id);
	db.contactlist.remove({_id: mongojs.ObjectId(id)}, function(err, doc){
		res.json(doc);
	});
});

router.put('/:id', function(req,res)
{
	var id = req.params.id;
	console.log("Received an Update request contact with _id "+ id);

	db.contactlist.findAndModify( {query: {_id: mongojs.ObjectId(id)},
		update: {$set: {name: req.body.name, email: req.body.email, number: req.body.number}},
		new: true}, function(err, doc){
			res.json(doc);
		});
});

module.exports = router;
