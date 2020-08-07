const socket = http => {
    const io = require('socket.io')(http);

    io.on('connection', (socket) => {
        console.log("a user connected");
    
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    
        socket.on('chat', (msg) => {
            io.emit('recieve', msg);
        });
    });
};

module.exports = socket;