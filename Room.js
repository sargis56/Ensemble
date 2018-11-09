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
        for (var i = 0; i < this.clients.length; i++) {
            console.log(this.clients[i].key);
            if (this.clients[i].key === id) {
                this.clients.splice(i, 1);
                console.log("splice array for that user");
            }
        }
    };
    return Room;
}());
exports.default = Room;
