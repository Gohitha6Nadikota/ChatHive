const express=require('express');
const dotenv=require('dotenv');
const {chats}=require('./data/data');
const connectDB = require('./config/db');
const {notFound,errorHandler}=require('./middlewares/errorMiddleware')
const userRoutes=require('./routes/userRoutes')
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes=require("./routes/messageRoutes")
const app=express();
const path=require('path')
dotenv.config();
connectDB();
app.use(express.json())

app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
app.use("/api/message", messageRoutes)


const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    console.log(process.env.NODE_ENV)
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}


app.use(notFound);
app.use(errorHandler);
const PORT=process.env.PORT
const server=app.listen(PORT,console.log(`Server started at ${PORT}`));
const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:'http://localhost:3000'
    }
})
io.on("connection",(socket)=>{
    console.log("Connected to Socket.io")

    socket.on('setup',(userData)=>{
        socket.join(userData)
        socket.emit("connected")
    })

    socket.on("join chat",(room)=>{
        socket.join(room)
        //console.log("joined "+room)
    })
    socket.on('typing',(room)=>socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    socket.on('send message',(newMessage)=>{
        var chat=newMessage.chat;
        if(!chat.users)
        {
            console.log("No users found");
        }
        chat.users.forEach(user => {
            if(user._id===newMessage.sender._id)
                return;
            socket.in(user._id).emit("Message Recieved",newMessage);
        });
    })
    socket.off("setup", (userData) => {
      console.log("disconnected");
      socket.leave(userData);
    });
})