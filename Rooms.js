"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Room_1 = __importDefault(require("./Room"));
var Rooms = /** @class */ (function () {
    function Rooms() {
        this.roomList = {};
    }
    Rooms.prototype.addRoom = function (room_id, room_password, user_id) {
        if (this.roomList[room_id] === undefined) {
            var newRoom = new Room_1.default(room_id, room_password, user_id);
            this.roomList[room_id] = newRoom;
            console.log("room list", this.roomList);
            return room_id;
        }
        else {
            return false;
            //room exists
        }
    };
    Rooms.prototype.joinRoom = function (room_id, room_password) {
        if (this.roomList[room_id] === undefined) {
            return false;
        }
        else {
            if (this.roomList[room_id].room_password == room_password) {
                return true;
            }
            else {
                return false;
            }
        }
    };
    Rooms.prototype.removeRoom = function (room_id) {
        if (this.roomList[room_id] != undefined) {
            //this.roomList.splice(, 1);
            console.log("removed room with id", room_id);
        }
        else {
            console.log("could not remove room with id of", room_id);
        }
    };
    Rooms.prototype.getRoomClients = function (room_id) {
        if (this.roomList[room_id]) {
            console.log("retreived room clients from room with id", room_id);
            return this.roomList[room_id].clients;
        }
        else {
            this.addRoom;
            console.log("could not get clients for room with id of", room_id);
            return null;
        }
    };
    Rooms.prototype.addClient = function (room_id, user_id, ws) {
        if (this.roomList[room_id] != undefined) {
            this.roomList[room_id].addClient(user_id, ws);
            console.log("added client to room with id", room_id);
            console.log("room list", this.roomList);
            return true;
        }
        else {
            // this.addRoom(room_id);
            /*
            this.roomList[room_id].addClient(user_id, ws);
            console.log("added client to a new room with id of", room_id);
            console.log("room list",this.roomList);*/
            return false;
        }
    };
    Rooms.prototype.removeClient = function (room_id, user_id) {
        if (this.roomList[room_id] != undefined) {
            this.roomList[room_id].removeClient(user_id);
            console.log("removed client from room with id", user_id);
            return true;
        }
        else {
            console.log("could not remove user from room with id", room_id);
            return true;
        }
    };
    Rooms.prototype.removeSong = function (room_id, track_id) {
        if (this.roomList[room_id] != undefined) {
            this.roomList[room_id].removeFromTrack(track_id); /////////////////////////////////
            console.log("Song Removed");
            return true;
        }
        else {
            console.log("could not remove song");
            return true;
        }
    };

    Rooms.prototype.addSong = function (room_id, user_id, track_id, track_title, track_uri) {
        if (this.roomList[room_id] != undefined) {
            this.roomList[room_id].addTrack(track_id, track_title, user_id, track_uri);
            console.log("added song");
            return true;
        }
        else {
            console.log("could not add song");
            return true;
        }
    };
    Rooms.prototype.getRoomPlaylist = function (room_id) {
        if (this.roomList[room_id] != undefined) {
            return this.roomList[room_id].tracks;
        }
        else {
            console.log("could not get playlist");
            return true;
        }
    };
    Rooms.prototype.getRoomAdmin = function (room_id) {
        if (this.roomList[room_id] != undefined) {
            return this.roomList[room_id].tracks;
        }
        else {
            console.log("could not get playlist");
            return false;
        }
    };
    return Rooms;
}());
exports.default = Rooms;
