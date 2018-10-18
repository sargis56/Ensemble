class Room{

    roomName: String;
    roomPassword :String;

    admin: User;
    conotributors: User[];

    playlist: Song[];

    constructor(roomN: String, roomPass: String){
        this.roomName = roomN;
        this.roomPassword = roomPass;
    }

    create(){
        daniel: string = "hello";
    }
    
    

    join (pass: String, newUser: User){
        if(pass == this.roomPassword){
            this.conotributors.push(newUser);
            return true;
        }else{
            return false;
        }
    }

    exit(user: User){
        // this.conotributors.slice();
    }

    addSong(newSong: Song){
        this.playlist.push(newSong);
    }

}

export = Room;