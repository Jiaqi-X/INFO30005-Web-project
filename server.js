// Food Buddy server, with prototype HTML in the route handlers
const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const port = process.env.PORT || 8080
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
// body parser
app.use(bodyParser.json());
app.use(cors())


io.of('/apt/socket').on("connection",(socket) =>{
	console.log("socket.io: User connected: ",socket.id);
	socket.on("disconnect",() =>{
		console.log("socket.io: User disconnected: ",socket.id);
	})
});

const mongodb = require('./config/key').mongoURL;
mongoose.
	connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true }).
	then(() => console.log("MongoDB Connected ..."));


const connection = mongoose.connection;
connection.once("open",() =>{
	console.log("Setting change streams");
	const orderChangeStream = connection.collection("orders").watch();
	
	orderChangeStream.on("change",(change)=>{
		switch(change.operationType) {
			case "insert" :
				console.log("insertion detected at backend");
				const order = {
					_id: change.fullDocument._id,
					customer:change.fullDocument.customer,
					vendor:change.fullDocument.vendor,
					snacks:change.fullDocument.snacks,
					createdAt:change.fullDocument.createdAt
				}
				io.of("/api/socket").emit("newOrder", order);
				break;
			
			case "update":
				console.log("update detected at backend");
				io.of("/api/socket").emit("updateOrder",change.documentKey._id);
				break;
			
			case "delete":
				console.log("deletion detected at backend");
				io.of("/api/socket").emit("deleteOrder".change.documentKey._id);
				break;
		}
	})
})


// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, we have to set it to false.
mongoose.set('useFindAndModify', false);


// Get all routers 
const user = require("./routes/userRoute");
const vendor = require("./routes/vendorRoute");
const snack = require("./routes/snackRoute");
const order = require("./routes/orderRoute");


// Use the routers with path
app.use('/vendor', vendor);
app.use('/snack', snack);
app.use('/order', order);
app.use('/user', user);


if (process.env.NODE_ENV === 'production') {

	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

server.listen(port, () =>
	console.log('Server listening for requests ...'))

module.exports = app;