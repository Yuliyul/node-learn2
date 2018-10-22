var mongoose = require('mongoose');
var validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
var UserSchema = new mongoose.Schema(
	{
	email:{
		type:String,
		required: true,
		trim:true,
		minlength:1,
		unique:true,
		validate : (value)=> {
			return validator.isEmail(value);
		},
		message: "{VALUE} is not valid"
	},
	password:{
		type:String,
		required: true,
		trim:true,
		minlength:6
	},
	tokens:[{
		access:{
			required:true,
			type:String
		},
		token:{
			required:true,
			type:String
		}
	}
	]
});
UserSchema.methods.toJSON = function(){
	var user = this;
	var UserObject = user.toObject();
	return _.pick(UserObject, ['_id', 'email']);
};
UserSchema.methods.generateAuthToken = function (){
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id : user._id.toHexString(), access}, 'secret').toString();
	//user.tokens.push(access, token);
	user.tokens = user.tokens.concat([{access, token}]);
	return user.save().then(()=>{
		return token;
	});
};

var User = mongoose.model('User', UserSchema);
module.exports = {User};