const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'password1';
// bcrypt.genSalt(10, (err, salt)=>{
// 	bcrypt.hash(password, salt, (err, hash)=>{
// 		console.log(hash);
// 	});
// });
var result = "$2a$10$FGsJj/whNAvdFTO/KAL09.koynVjZBDgOBGmK6Fze3cMlAnIup9Cm";
bcrypt.compare(password, result, (err, res)=>{
	console.log(res);
});

// var message = 'I am user 3';
// var hash = SHA256(message).toString();
// // console.log(`Message ${message}`);
// // console.log(`Hash ${hash}`);
// var data = {
// 	id:4
// };
// var token = {
// 	data,
// 	hash:SHA256(JSON.stringify(data) + 'somesecter').toString()
// };
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecter').toString();
// console.log(`resultHash is ${resultHash}`);
// if(resultHash === token.hash)
// 	console.log('Verified');
// else
// 	console.log('Damaged');
//
// //USING jsonwebtoken
//
// var token2  = jwt.sign(data, 'somesecter');
// console.log(`token2 is ${token2}`);
// var decoded = jwt.verify(token2, 'somesecter');
// console.log('decoded ', decoded);
