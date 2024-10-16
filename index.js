require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const http = require('http');
const connectMongoDb  = require('./connection');
const  verifyToken  = require('./middlewares/auth');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');
const redisRouter = require('./routes/redis');
const  { setupWebSocket }  = require('./utils/websocket');
const routes = require('./routes/index');
const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

setupWebSocket(server);

app.use(express.json());


connectMongoDb.connect().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB: ', err);
});
app.use('/api', routes);
app.get('/', (req, res) => {   
    res.send('Hello World');    
});


server.listen(8000, () => {
    console.log('Server running on http://localhost:8000/');
});