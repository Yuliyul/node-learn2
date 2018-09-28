const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id="6bae10bd881d7016a0bd1c8a1111111";
if(!(ObjectId.isValid(id)))
	console.log('Not valid');
// Todo.find({_id:id}).then((todos) =>{
// 	console.log('Todos:',todos);
// });

// Todo.findOne().then((res) => {console.log('FindIne :::' , res)});
Todo.findById(id).then((res) => {
	if(!res)
		return console.log('Id not found');
	console.log('FindBID :::' , res);
}).catch((e) => {console.log(e)});