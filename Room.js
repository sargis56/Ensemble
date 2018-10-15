"use strict";
var Room = /** @class */ (function () {
    function Room(roomN, roomPass) {
        this.roomName = roomN;
        this.roomPassword = roomPass;
    }
    Room.prototype.create = function () {
    };
    Room.prototype.join = function (pass, newUser) {
        if (pass == this.roomPassword) {
            this.conotributors.push(newUser);
            return true;
        }
        else {
            return false;
        }
    };
    Room.prototype.exit = function (user) {
        // this.conotributors.slice();
    };
    Room.prototype.addSong = function (newSong) {
        this.playlist.push(newSong);
    };
    return Room;
}());
module.exports = Room;
