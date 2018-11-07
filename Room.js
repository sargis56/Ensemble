"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Room = /** @class */ (function () {
    function Room(roomN, roomPass, creator) {
        this.conotributors = [];
        this.blockedUsers = [];
        this.playlist = [];
        this.roomName = roomN;
        this.roomPassword = roomPass;
        this.admin = creator;
        this.roomId = roomN + "-" + this.generateRandomString(10);
    }
    Room.prototype.userJoin = function (newUser) {
        this.conotributors.push(newUser);
    };
    Room.prototype.userExit = function (user) {
        // this.conotributors.slice();
    };
    Room.prototype.addSong = function (newSong) {
        this.playlist.push(newSong);
    };
    Room.prototype.generateRandomString = function (length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };
    ;
    Room.prototype.containsUser = function (username) {
        for (var i = 0; i < this.conotributors.length; i++) {
            if (this.conotributors[i].username == username) {
                return true;
            }
        }
        return false;
    };
    Room.prototype.getUsersUsernames = function () {
        var usernames = [];
        for (var i = 0; i < this.conotributors.length; i++) {
            usernames.push(this.conotributors[i].username);
        }
        return usernames;
    };
    return Room;
}());
exports.default = Room;
