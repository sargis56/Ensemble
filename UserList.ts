import User from './User';

export default class UserList {
    Users : User[];

    constructor(){
        this.Users = [];
    }

    NewUser(username: string, key:string){
        var newUser: User;
        var user = this.getUserByUsername(username);
        if(user === null ){
            newUser = new User(username, key);
            this.Users.push(newUser);
            // console.log("return new user");
            return newUser;
        }else{
            //user already exists
            //update key
            user.key = key;
            // console.log("return existing user");
            return user;
        }

    }

    getUserByUsername(username: string){
        var found: boolean = false;
        for(var i : number = 0; i < this.Users.length; i++){
            if(this.Users[i].username === username){
                found = true;
                return this.Users[i];
            }
        }
        return null;
    }

    setUserWebSocket( username: string, websocket: WebSocket){
        var user = this.getUserByUsername(username);
        if(user != null){
            user.setWebSocket(websocket);
        }
    }

    getUserByAccessToken(key: string){
        var found: boolean = false;
        for(var i : number = 0; i < this.Users.length; i++){
            if(this.Users[i].key === key){
                found = true;
                return this.Users[i];
            }
        }
        return null;
    }

    getUserCount(){
        return this.Users.length;
    }
}

