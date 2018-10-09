const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');

var todos = [
{
	_id:new ObjectId(),
	text:"todo1"},
{_id:new ObjectId(),text:"todo2", "completed":true, "completedAt":"111"},
{_id:new ObjectId(),text:"todo3"}];
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