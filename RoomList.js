"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Room_1 = __importDefault(require("./Room"));
var RoomList = /** @class */ (function () {
    function RoomList() {
        this.Rooms = [];
    }
    RoomList.prototype.create = function (roomName, roomPass, creator) {
        if (this.getRoomByName(roomName) === null) {
            var newRoom = new Room_1.default(roomName, roomPass, creator);
            this.Rooms.push(newRoom);
            return newRoom;
        }
        else {
            //room with that name already exists
            return null;
        }
    };
    RoomList.prototype.join = function (roomName, roomPass, user) {
        var room = this.getRoomByName(roomName);
        if (room === null) {
            return null;
        }
        else {
            if (room.roomPassword === roomPass) {
                room.userJoin(user);
                return room;
            }
            else {
                return null;
            }
        }
    };
    RoomList.prototype.getRoomByName = function (name) {
        var found = false;
        for (var i = 0; i < this.Rooms.length; i++) {
            if (this.Rooms[i].roomName === name) {
                found = true;
                return this.Rooms[i];
            }
        }
        return null;
    };
    RoomList.prototype.getRoomById = function (id) {
        for (var i = 0; i < this.Rooms.length; i++) {
            if (this.Rooms[i].roomId === id) {
                console.log("room found");
                return this.Rooms[i];
            }
        }
        console.log("room not found");
        return null;
    };
    RoomList.prototype.getContributorsRoom = function (user) {
        //check for contributor
        for (var i = 0; i < this.Rooms.length; i++) {
            var roomContributors = this.Rooms[i].conotributors;
            for (var j = 0; j < roomContributors.length; j++) {
                if (this.Rooms[i].conotributors[j].username === user.username) {
                    return this.Rooms[i];
                }
            }
        }
        return null;
    };
    RoomList.prototype.getAdminsRoom = function (user) {
        //first check for admin
        for (var i = 0; i < this.Rooms.length; i++) {
            if (this.Rooms[i].admin.username === user.username) {
                return this.Rooms[i];
            }
        }
        return null;
    };
    RoomList.prototype.test = function () {
        console.log("room list test");
    };
    return RoomList;
}());
exports.default = RoomList;
