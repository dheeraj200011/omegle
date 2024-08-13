const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const router = require("./routes/simpleRoutes");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use("/", router);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const waitingRoom = []; // isme wo users honge jo bhi online honge...

// isme hum rooms ko list karenge jisme users rooms wise chat kar sakte hai...

const rooms = {};

io.on("connection", (socket) => {
   socket.on("joinroom", () => {
    if(waitingRoom.length > 0) {
    let partner = waitingRoom.shift();
    let roomname = `${socket.id}-${partner.id}`;

    socket.join(roomname);
    partner.join(roomname);

    io.to(roomname).emit("joined", roomname);
    } else {
        waitingRoom.push(socket);
    }
   })

   // ab backend me signaling message ko socket.on hi help de inject karenge.

   socket.on("signalingMessage", (data) => {
    socket.broadcast.to(data.room).emit("signalingMessage", data.message);
   });

   socket.on("message", (data) => {
    socket.broadcast.to(data.room).emit("message", data.message);
   });

   socket.on("startVideoCall", ({room}) => {
    socket.broadcast.to(room).emit("incomingCall");
   });

   socket.on("acceptCall", ({room}) => {
    socket.broadcast.to(room).emit("callAccepted");
   });

   socket.on("rejectCall", ({room}) => {
    socket.broadcast.to(room).emit("callRejected");
   });



   // disconnect users

   socket.on("disconnect", () => {
    let index = waitingRoom.findIndex(watinguser => watinguser.id === socket.id);
    waitingRoom.splice(index, 1);
   })

  
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});