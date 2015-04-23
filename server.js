var express = require('express');
var app = express();

app.use(express.static(__dirname + "/client"));

// require('./config/mongoose.js');
// require('./config/routes.js')(app);

app.listen(3000,function(){
	console.log("Listening on port 3000");
});