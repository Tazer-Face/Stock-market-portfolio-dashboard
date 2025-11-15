const express = require("express");
const app = express();
const stockRoutes = require("./routes/stockRoutes");
const {connectDB,disconnectDB} = require("./config/databases");
const stockData = require("./Stock data/stockData");
const cors = require('cors');


connectDB();

const port = 4005;

const server = app.listen(port ,() => {
  console.log("App + WebSocket running on port 4005");
});


stockData(server);

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

app.use(express.json());

app.use('/api/stocks',stockRoutes);

process.on('SIGINT',() => disconnectDB('SIGINT'));
process.on('SIGTERM',() => disconnectDB('SIGTERM'));

app.listen(3000,()=>{console.log("server running on port 3000")});
