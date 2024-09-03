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

app.listen(5000, console.log("server started on port 5000"));