var express = require('express');
var app = express();

app.use(express.static(__dirname + "/client"));

// require('./config/mongoose.js');
// require('./config/routes.js')(app);

var server = app.listen(3000,function(){
	console.log("Listening on port 3000");
});

var io = require('socket.io').listen(server);
var users = {};
var rooms = ['Lobby'];
var totalUsers = 0;
var walls;
var players = [];
io.sockets.on('connection',function(socket){
	socket.on('newUser',function(user){
		console.log("This fool: " + user + ', ' + socket.id + " connected");
		socket.user = user;
		socket.room = 'Lobby';
		users[user] = user;
		socket.join('Lobby');
		console.log(socket.room,totalUsers % 4);
		socket.emit('init',totalUsers % 4);
		if(totalUsers % 4 !== 0){
			console.log(walls.length);
			socket.emit('newWorld',walls);
		}
		totalUsers++;
	});

	socket.on('loop',function(data){
		socket.broadcast.emit('game',{playerData: data.player, user: socket.user, wallData: data.walls, bombsData: data.bombs});
	});

	socket.on('newPlayer',function(data){
		players.push(data);
		io.emit("players",players);
	});

	socket.on('world',function(data){
		console.log(data.length,"NEW WALLS");
		walls = data;
	});

	socket.on('disconnect',function(){
		if(totalUsers !== 0){
			totalUsers--;
		}
		delete users[socket.user];
		for(var player in players){
			if(players[player].user == socket.user){
				delete players[player];
			}
		}
		io.emit("players",players);
		socket.leave(socket.room);
		console.log(socket.user + " left");
	});
});