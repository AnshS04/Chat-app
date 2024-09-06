const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./Config/db");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const { notFound, errorHandler } = require("./Middleware/errorMiddleware");

dotenv.config();
connectDb();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is running");
})

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

app.use(notFound)
app.use(errorHandler)

const server = app.listen(5000, console.log("server started on port 5000"));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user in room", room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageReceived) => {
        const chat = newMessageReceived.chat;

        if(!chat.users) {
            return console.log("chat users not defined");
        }

        chat.users.forEach(user => {
            if(user._id == newMessageReceived.sender._id) {
                return;
            }

            socket.in(user._id).emit("message received", newMessageReceived);
        })
    });

    socket.off("setup", () => {
        console.log("user dc");
        socket.leave(userData._id);
    })
});