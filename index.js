

require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ["http://localhost:3000", "http://192.168.190.70:3000"],
        methods: ["GET", "POST"]
    }
});

// Import routes
const allroutes = require('./routes/allroutes');
const signalingRoutes = require('./routes/signaling');

// Middleware
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', allroutes);

// Pass the io instance to signalingRoutes
signalingRoutes(io);

// Connect to MongoDB and start the server
mongoose.connect(process.env.COMP_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        server.listen(process.env.PORT, () => {
            console.log(`Server is running on http://localhost:${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });


    