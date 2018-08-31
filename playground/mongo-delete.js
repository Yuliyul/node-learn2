// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/ToDo', (err, db)=>{
	if(err)
		return console.log('UNABLE to connect');
	console.log('connected');
	// db.collection('ToDo').deleteMany({text:"breakfast"}).then((result)=>{
	// 	console.log(result);
	// });
	// db.collection('ToDo').deleteOne({text:"ttt"}).then((result)=>{
	// 	console.log(result);
	// });
	db.collection('ToDo').findOneAndDelete({completed:false}).then((result)=>{
		console.log(result);
	});
	
});
