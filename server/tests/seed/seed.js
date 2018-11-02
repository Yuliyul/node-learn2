const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');
var {Todo} = require('./../../models/todo');
var {User} = require('./../../models/user');
var Id1 = new ObjectId();
var Id2 = new ObjectId();
var todos = [
{	_id:new ObjectId(),	text:"todo1", _creator:Id1},
{_id:new ObjectId(),text:"todo2", "completed":true, "completedAt":"111",_creator:Id2},

];

const populateTodo = (done)=>{
	Todo.remove({})
	.then(()=>{return Todo.insertMany(todos);})
	.then(()=>done());
};

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
  password : "passworD2",
	tokens : [
    {
      access : 'auth',
      token : jwt.sign({_id : Id2.toHexString(), access:"auth"}, 'secret').toString()
    }
  ]
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
