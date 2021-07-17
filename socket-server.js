'use strict';

const socketIO = require('socket.io');
const ot = require('ot');
var roomList = {};

module.exports = function(server) {
    var str = '//This is a you work area\n\n';

    const io = socketIO(server);
    io.on('connection', function(socket) {
        socket.on('joinRoom', function(data) {
            if (!roomList[data.room]) {
                var socketIoServer = new ot.EditorSocketIOServer(str, [], data.room, function(socket, sb) {
                    var self = this;
                    Task.findByIdAndUpdate(data.room, {content: self.document}, function(err) {
                        if (err) return cb(false);
                        cb(true);
                    });
                });
                roomList[data.room] = socketIoServer;
            }
            roomList[data.room].addClient(socket);
            roomList[data.room].setName(socket, data.username);

            socket.room = data.room;
            socket.join(data.room);
        });

        socket.on('chatMessage', function (data) {
            io.to(socket.room).emit('chatMessage', data);
        });

        socket.on('disconnect', function () {
            socket.leave(socket.room);
        });
    });
};