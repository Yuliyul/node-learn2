var express = require('express');
var bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');

const port = process.env.PORT || 3000;
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
		res.status(400).send(e);
	});
});
app.get('/todos', (req, res) => {
	Todo.find().then((todos)=>{
		res.send({todos});
	},
	(e)=>{
		res.status(400).send(e);
	})
});
app.get('/todos/:id', (req, res) => {
	var id = req.params.id;
	if(!(ObjectId.isValid(id)))
		res.status(404).send();
	Todo.findById(id).then((todos)=>{
		if(!todos)
			return res.status(404).send();
		res.send({todos});
	},
	(e)=>{
		res.status(400).send();
	})

});
app.listen(port, ()=>{console.log(`Started on port ${port}`)});

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