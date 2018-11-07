
export default class User {

    username: string;
    key: string;
    ws = null;

    constructor(username: string, key: string){
        // console.log("create new user :" + username);
        this.username = username;
        this.key = key;
    }

    setWebSocket( ws: any ){
        this.ws = ws;
    }

}

