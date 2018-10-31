"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = __importDefault(require("./User"));
var UserList = /** @class */ (function () {
    function UserList() {
        this.Users = [];
    }
    UserList.prototype.NewUser = function (username, key) {
        var newUser;
        var user = this.getUserByUsername(username);
        if (user === null) {
            newUser = new User_1.default(username, key);
            this.Users.push(newUser);
            // console.log("return new user");
            return newUser;
        }
        else {
            //user already exists
            //update key
            user.key = key;
            // console.log("return existing user");
            return user;
        }
    };
    UserList.prototype.getUserByUsername = function (username) {
        var found = false;
        for (var i = 0; i < this.Users.length; i++) {
            if (this.Users[i].username === username) {
                found = true;
                return this.Users[i];
            }
        }
        return null;
    };
    UserList.prototype.getUserByAccessToken = function (key) {
        var found = false;
        for (var i = 0; i < this.Users.length; i++) {
            if (this.Users[i].key === key) {
                found = true;
                return this.Users[i];
            }
        }
        return null;
    };
    UserList.prototype.getUserCount = function () {
        return this.Users.length;
    };
    return UserList;
}());
exports.default = UserList;
