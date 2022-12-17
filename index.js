const express = require('express');
const app = express();
const http = require('http');

const serverIn = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(serverIn, {
    cors: "*"
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    let addedProducts = [];
    socket.on('add-product', (data) => {
        addedProducts.push(JSON.parse(data.product))
        io.emit( 'display-product', addedProducts );
    });
    socket.on('clear-cart', (data) => {
        addedProducts = [];
        io.emit( 'display-product', addedProducts );
    });
    socket.on('remove-from-cart', (data) => {
        let deleteIndex = addedProducts.findIndex((product) => product.name == data.product);
        addedProducts.splice(deleteIndex,1)
        io.emit( 'display-product', addedProducts );
    });
});

serverIn.listen(3000, () => {
    console.log('listening on *:3000');
});