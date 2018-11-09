"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Room = /** @class */ (function () {
    function Room(room_id) {
        this.clients = [];
        this.room_id = room_id;
        this.clients = [];
    }
    Room.prototype.addClient = function (id, webSocket) {
        this.clients.push({ key: id, value: webSocket });
    };
    Room.prototype.removeClient = function (id) {
        var index = -1;
        if (index > -1) {
            // this.clients.splice(index, 1);
            console.log("removed client with id", id);
        }
        else {
            console.log("could not remove client with id of", id);
        }
    };
    return Room;
}());
exports.default = Room;
