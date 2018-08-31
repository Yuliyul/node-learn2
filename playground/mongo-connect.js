// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
var user = {name:"yul", age:40};
var {name} = user;
console.log(name);
var obj = new ObjectID();
console.log(obj);
MongoClient.connect('mongodb://localhost:27017/ToDo', (err, db)=>{
	if(err)
		return console.log('UNABLE to connect');
	console.log('connected');
	db.collection('ToDo').find({_id: new ObjectID("5b8804da47ef284213e4d15a")}).toArray().then((docs)=>{
		console.log(docs);
	}, (err)=>{
		console.log("UNABLE to fetch ", err);
	});
	db.collection('ToDo').find().count().then((docs)=>{
		console.log(docs);
	}, (err)=>{
		console.log("UNABLE to count ", err);
	});
	// db.collection('ToDo').insertOne(
	// 	{
	// 		text : "First todo",
	// 		completed : false
	// 	},
	// 	(err, res)=>{
	// 		if(err)
	// 			return console.log('UNABLE to insert', err);
	// 		console.log(JSON.stringify(res.ops, undefined, 2 ));
	// 	});
	// db.collection('Users').insertOne(
	// 	{
	// 		name : "Yul todo",
	// 		age : 30,
	// 		location: "Maroipol"
	// 	},
	// 	(err, res)=>{
	// 		if(err)
	// 			return console.log('UNABLE to insert', err);
	// 		console.log(res.ops[0]._id.getTimestamp());
	// 	});
	//db.close(); 
});
