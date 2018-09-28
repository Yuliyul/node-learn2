var express = require('express');
var bodyParser = require('body-parser');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');

var app = express();
app.use(bodyParser.json());
app.post('/todos', (req,res)=>{
	var ntodo = new Todo({
		text : req.body.text,
		completed:req.body.completed
	});
	ntodo.save().then((doc)=>{
		res.send(doc);
	},
	(e)=>{
		res.send(e);
	});
});
app.listen(3000, ()=>{console.log('Started on port 3000')});

module.exports = {app};



// var newTodo = new Todo({
// 	text:'Cook maffins'
// });


// var newTodo = new Todo({
// 	text:'Learn node',
// 	completed:false,
// 	completedAt:null
// });
// newTodo.save().then((doc)=>{
// 	console.log('Saved ', doc);
// },
// 	(e)=>{
// 		console.log('cannot save');
// 	});