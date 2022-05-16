# node-crud-app
download package
<!--   "bcryptjs": "^2.4.3",
    "body-parser": "^1.20.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.1",
    "express": "^4.18.1",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^6.3.3" -->

We create the repository and install the dependencies. The entry point is the server. ...
express: It is a minimal and flexible Node. ...
Setup Express Web Server. ...
Create and configure the .env file. ...
./src/db/schema.js. ...
./src/db/connection.js. ...
./src/middlewares/index.js. ...
Now, we code the API Endpoints.

The CRUD paradigm stands for the four primitive database operations that are CREATE, READ, UPDATE and DELETE.

Methods	Urls	Description
GET	api/employees	Get all employees
GET	api/employees/id	Get a specific employee
POST	api/employees	Create a new employee
PUT	api/employees/id	Update an existing employee
DELETE	api/employees/id	Delete an existing employee

#step to install
 npm init
 npm install express helmet morgan body-parser monk joi dotenv --save 
 npm install nodemon --save-dev
 
 #meaning
 express: It is a minimal and flexible Node.js web application framework.
helmet: It helps in securing HTTP headers in express applications.
morgan: It is an HTTP request logger middleware for Node. js
body-parser: It is responsible for parsing the incoming request bodies.
monk: A tiny layer that provides substantial usability improvements for MongoDB usage.
joi: It is an object schema description language and object validator.
dotenv: It loads environment variables from a .env file.
nodemon: It restarts automatically the node application when file changes in the directory have been detected.



#some usefull method defination
setTimeout/clearTimeout – This is used to implement delays in code execution.
setInterval/clearInterval – This is used to run a code block multiple times.
setImmediate/clearImmediate – Any function passed as the setImmediate() argument is a callback that's executed in the next iteration of the event loop.
process.nextTick – Any function passed as the setImmediate() argument is a callback that's executed in the next iteration of the event loop
