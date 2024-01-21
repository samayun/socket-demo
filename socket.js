import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {} 
});
const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'socket.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('connection', (msg) => {
    console.log(socket.id+' connection: ' + msg);
    socket.emit('receivedMessage',  'connection #'+ socket.id  + '\'ve said  '+ msg);
  });

  socket.on('chat message', (msg) => {
    console.log(socket.id+' message: ' + msg);
    // On same browser
    socket.emit('receivedMessage',  'Client #'+ socket.id  + '\'ve said  '+ msg);
    // on diiffrent browser
    socket.broadcast.emit('BroadCastmessage', msg);
  });

  if (!socket.recovered) {
     console.log(`NOT RECOVERED`)
  }
});


io.on('disconnect', (socket) => {
  console.log('a user disconnected', socket.id);
});


server.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});
