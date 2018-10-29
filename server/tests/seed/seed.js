const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');
var {Todo} = require('./../../models/todo');
var {User} = require('./../../models/user');

var todos = [
{
	_id:new ObjectId(),
	text:"todo1"},
{_id:new ObjectId(),text:"todo2", "completed":true, "completedAt":"111"},
{_id:new ObjectId(),text:"todo3"}];

const populateTodo = (done)=>{
	Todo.remove({})
	.then(()=>{return Todo.insertMany(todos);})
	.then(()=>done());
};
var Id1 = new ObjectId();
var Id2 = new ObjectId();
var users = [
{
	_id : Id1,
	email:"moka1@test.com",
  password : "passworD1",
  tokens : [
    {
      access : 'auth',
      token : jwt.sign({_id : Id1.toHexString(), access:"auth"}, 'secret').toString()
    }
  ]
},
{
	_id : Id2,
	email:"moka2@test.com",
  password : "passworD2"
}];
const populateUser = (done)=>{
	User.remove({})
	.then(()=>{
    var userOne = new User(users[0]).save();
    var user2 = new User(users[1]).save();
    return Promise.all([userOne, user2]);
  })
	.then(()=>done());
};

module.exports = {todos, populateTodo, users, populateUser};
