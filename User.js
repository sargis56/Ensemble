"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User = /** @class */ (function () {
    function User(username, key) {
        this.ws = null;
        // console.log("create new user :" + username);
        this.username = username;
        this.key = key;
    }
    User.prototype.setWebSocket = function (ws) {
        this.ws = ws;
    };
    return User;
}());
exports.default = User;
