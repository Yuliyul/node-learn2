const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');
var {User} = require('./../models/user');
var {todos, populateTodo, users, populateUser} = require('./seed/seed');

beforeEach(populateUser);
beforeEach(populateTodo);
describe('POST /todos', ()=>{
	it('should create new todo', (done)=>{
		var text = 'Test text';
		request(app)
		.post('/todos')
		.set('x-auth', users[0].tokens[0].token)
		.send({text})
		.expect(200)
		.expect((res)=>{
			expect(res.body.text).toBe(text);
		})
		.end((err, res) => {
			if(err)
				return done(err);
			Todo.find({text}).then((todos)=>{
				expect(todos.length).toBe(1);
				expect(todos[0].text).toBe(text);
				done();

			}).catch((e)=>done(e));
		});

	});

	it('should not create new todo', (done)=>{
		request(app)
		.post('/todos')
		.set('x-auth', users[0].tokens[0].token)
		.send({})
		//.expect(400)
		.end((err, res) => {
			if(err)
				return done(err);
			Todo.find().then((todos)=>{
				expect(todos.length).toBe(2);
				done();

			}).catch((e)=>done(e));
		});

	});
}
);
describe('GET todos', ()=>{
	it('should get all todos', (done)=>{
		request(app)
		.get('/todos')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res)=>{
			expect(res.body.todos.length).toBe(1)
		})
		.end(done);
	});
});
describe('GET todos:id', ()=>{
	it('should get one todo', (done)=>{
		request(app)
		.get(`/todos/${todos[0]._id.toHexString()}`)
		.expect(200)
		.expect((res)=>{
			expect(res.body.todos.text).toBe(todos[0].text)
		})
		.end(done);
	});

	it('should get 404 on valid ID', (done)=>{
		tmpid = new ObjectId();
		request(app)
		.get(`/todos/${tmpid.toHexString()}`)
		.expect(404)
		.end(done);
	});

	it('should get 404 on dummy id', (done)=>{
		tmp = 123456;
		request(app)
		.get(`/todos/${tmp}`)
		.expect(404)
		.end(done);
	});
});

describe('DELETE todo/id', ()=>{
	var idd = todos[1]._id.toHexString();
	it('should delete 1 todo', (done)=>{
		request(app)
		.delete(`/todos/${idd}`)
		.expect(200)
		.expect((res)=>{
			expect(res.body.todos._id).toBe(idd);
		})
		.end((err, res)=>{
			if(err)
				return done(err);
			Todo.findById(idd).then((todo)=>{
				expect(todo).toBeFalsy();
				done();
			}).catch((e)=>done(e));
		});
	});
	it('should return 404 if not found', (done)=>{
		tmpid = new ObjectId();
		request(app)
		.delete(`/todos/${tmpid.toHexString()}`)
		.expect(404)
		.end(done);

	});
	it('should return 404 if not valid', (done)=>{
		tmpid = 1234656;
		request(app)
		.delete(`/todos/${tmpid}`)
		.expect(404)
		.end(done);
	});

});
describe('PATCH tests', ()=>{
	var tmpid = todos[0]._id.toHexString();
	var upd = {"text":"updated", "completed":"true"};
	var text = "Updates";
	it('should update todo', (done)=>{
		request(app)
		.patch(`/todos/${tmpid}`)
		.send({completed:true, text})
		.expect(200)
		.expect((todo)=>{
			expect(todo.body.todo.text).toBe(text);
			expect(todo.body.todo.completed).toBe(true);
			expect(typeof todo.body.todo.completedAt).toBe("number");
		})
		.end(done);
	});
	var tmpid = todos[1]._id.toHexString();
	var upd = {completed:false};
	it('should unset todo completed', (done)=>{
		request(app)
		.patch(`/todos/${tmpid}`)
		.send(upd)
		.expect(200)
		.expect((todo)=>{
			expect(todo.body.todo.completed).toBe(false);
			expect(todo.body.todo.completedAt).toBeFalsy();
		})
		.end(done);
	});
});
describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {
		request(app)
		.get('/users/me')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res)=>{
			expect(res.body._id).toBe(users[0]._id.toHexString());
			expect(res.body.email).toBe(users[0].email);
		})
		.end(done);

	});
	it('should return 401 if not authenticated', (done) => {
		request(app)
		.get('/users/me')
		//.set('x-auth', '')
		.expect(401)
		.expect((res)=>{
			expect(res.body).toEqual({});
		})
		.end(done);
	});
});
describe('POST /users', () => {
	it('should create a user', (done) => {
		var email = 'jijiji@kgf.gg';
		var password = 'fdsdfdf789';
		request(app)
		.post('/users')
		.send({email,password})
		.expect(200)
		.expect((res)=>{
			expect(res.headers['x-auth']).toBeTruthy();
			expect(res.body._id).toBeTruthy();
			expect(res.body.email).toBe(email);
		})
		.end((err)=>{
			if(err)
				return done(err);
			User.findOne({email}).then((user)=>{
				expect(user).toBeTruthy();
				expect(user.password).not.toBe(password);
				done();
			}).catch((e)=>{done(e);});
		});
	});
	it('should return validation errors if request invalid', (done) => {
		var email = 'moka2';
		var password = 'fd';
		request(app)
		.post('/users')
		.send({email,password})
		.expect(400)

		.end(done);

	});
	it('should not create user if email in use', (done) => {
		var email = 'moka2@test.com';
		var password = 'fdsdfdf789';
		request(app)
		.post('/users')
		.send({email,password})
		.expect(400)
		.end(done);

	});
});

describe('POST /users/login', ()=>{
	it('should login user and return token', (done) => {
		request(app)
		.post('/users/login')
		.send({email:users[1].email, password:users[1].password})
		.expect(200)
		.expect((res)=>{
			expect(res.headers['x-auth']).toBeTruthy();
			expect(res.body._id).toBeTruthy();
			expect(res.body.email).toBe(users[1].email);
		})
		.end((err, res)=>{
			if(err){
				return done(err);
			}
			User.findById(users[1]._id).then((user)=>{
				expect(user.tokens[0]).toMatchObject({
					access:"auth",
					token:res.headers['x-auth']
				});
				done();
			}).catch((e)=>{done(e);});
		});
	});
	it('should reject invalid login', (done) => {
		request(app)
		.post('/users/login')
		.send({email:users[1].email+'1', password:users[1].password+'1'})
		.expect(400)
		.expect((res)=>{
			expect(res.headers['x-auth']).not.toBeTruthy();
			expect(res.body._id).not.toBeTruthy();
			expect(res.body.email).not.toBeTruthy();
		})
		.end((err, res)=>{
			if(err)
				return done(err);
			User.findById(users[1]._id).then((user)=>{
				expect(user.tokens.length).toBe(0);
				done();
			}).catch((e)=>{done(e);})
		});
	});
});
describe('DELETE /users/me/token', ()=>{
	it('should delete token', (done)=>{
		request(app)
		.delete('/users/me/token')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.end((err, res)=>{
			if(err)
				return done(err);
			User.findOne({email : users[0].email}).then((user)=>{
				expect(user.tokens.length).toBe(0);
				done();
			}).catch((e)=>{done(e)});
		});
	});
});
