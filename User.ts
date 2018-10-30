
export default class User {

    username: string;
    key: string;

    constructor(username: string, key: string){
        // console.log("create new user :" + username);
        this.username = username;
        this.key = key;
    }

}

