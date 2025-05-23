

const express = require('express');
const http = require("http");
const socketio = require("socket.io");
const connectDB = require('./config/db')
const cors = require('cors'); 

connectDB();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');


const { verifyToken } = require('./middleware/authMiddleware');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

const allowedOrigin = process.env.CLIENT_URL || "https://ping-client-git-master-shivamparkars-projects.vercel.app";


app.use(cors({
  origin: allowedOrigin,
  credentials: true
})); 



app.use('/api/auth', authRoutes);
app.use('/api/users', verifyToken, userRoutes);
app.use('/api/chats', verifyToken, chatRoutes);


const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true
  }
});

require('./sockets/chatSocket')(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
