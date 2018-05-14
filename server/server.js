const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;
var publicPath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) =>{
  console.log('New user connected');

  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the chat app',
    created: new Date().getTime()
  });

  socket.broadcast.emit('newMessage', {
      from: 'Admin',
      text: 'New user joined',
      created: new Date().getTime()
  });

  socket.on('disconnect' , () => {
    console.log('User disconnected.');
  });

  socket.on('createMessage' , (newMessage) => {
    console.log('New message.', newMessage);
    io.emit('newMessage', {
      from: newMessage.from,
      text: newMessage.text,
      created: new Date().getTime()
    });
    // socket.broadcast.emit('newMessage', {
    //     from: newMessage.from,
    //     text: newMessage.text,
    //     created: new Date().getTime()
    // });
  });

});

server.listen(port, () => {
  console.log("Server started");
});
