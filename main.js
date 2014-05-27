// Gets http, filesystem(fs) and validator module
var http = require('http'),
    fs = require('fs'),
    sanitize = require('validator');

// Create server and reads client.html
var app = http.createServer(function (request, response) {
	fs.readFile("client.html", 'utf-8', function (error, data) {
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(data);
		response.end();
	});

}).listen(8080);

/** Stores directly the instace of Socket.io instead of the module
 *  Note: The listen() method also accept a port and others things! 
 *  But since we already have the http-server instace...
**/
var io = require('socket.io').listen(app);

// Creates an event handler in case of connection
io.sockets.on('connection', function(socket) {
	
	// Waits for an event called 'message_to_server' and emits the data in the form of an event called 'message_to_client'
	socket.on('message_to_server', function(data) {
		//Escape messages to prevent XSS attacks
		var escaped_message = sanitize.escape(data['message']);
		io.sockets.emit("message_to_client", { message: escaped_message });
	});
});


