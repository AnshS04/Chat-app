const expressAsyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");

const accessChat = expressAsyncHandler(async(req, res) => {
    const {userId} = req.body;

    if(!userId) {
        console.log("User Id param not sent with request");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find()
})

module.exports = accessChat;