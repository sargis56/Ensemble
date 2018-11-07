import User from './User';
import Song from './Song';

export default class Room {

    roomId: string;
    roomName: string;
    roomPassword: string;

    admin: User;
    conotributors: User[] = [];

    blockedUsers: String[] = [];

    playlist: Song[] = [];

    constructor(roomN: string, roomPass: string, creator: User) {
        this.roomName = roomN;
        this.roomPassword = roomPass;
        this.admin = creator;
        this.roomId = roomN + "-" + this.generateRandomString(10);
    }

    userJoin( newUser: User) {
        this.conotributors.push(newUser);
    }

    userExit(user: User) {
        // this.conotributors.slice();
    }

    addSong(newSong: Song) {
        this.playlist.push(newSong);
    }

    generateRandomString(length: number) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    containsUser(username: string){
        for(var i = 0; i < this.conotributors.length; i ++){
            if(this.conotributors[i].username == username){
                return true;
            }
        }
        return false;
    }

    getUsersUsernames(){
        var usernames = [];
        for(var i = 0; i < this.conotributors.length; i ++){
            usernames.push(this.conotributors[i].username);
        }
        return usernames;
    }

}

