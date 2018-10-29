var env = process.env.NODE_ENV || "development";
if(env==="development")
{
	process.env.PORT = 3000;
	process.env.MONGODB_URI =  'mongodb://127.0.0.1:27017/ToDo'
}
else if(env === "test")
{
	process.env.PORT = 3000;
	process.env.MONGODB_URI =  'mongodb://127.0.0.1:27017/ToDoTest'
}
