const expect = require('expect');
const request = require('supertest');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');

var todos = [
{text:"todo1"},{text:"todo2"}, {text:"todo3"}];
beforeEach((done)=>{
	Todo.remove({}).then(()=>{return Todo.insertMany(todos)}).then(()=>done());
});
describe('POST /todos', ()=>{
	it('should create new todo', (done)=>{
		var text = 'Test text';
		request(app)
		.post('/todos')
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
		.send({})
		//.expect(400)
		.end((err, res) => {
			if(err)
				return done(err);
			Todo.find().then((todos)=>{
				expect(todos.length).toBe(3);
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
		.expect(200)
		.expect((res)=>{
			expect(res.body.todos.length).toBe(3)
		})
		.end(done);
	});
});