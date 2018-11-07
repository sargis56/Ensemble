import Room from './Room';
import User from './User';

export default class RoomList {

    Rooms: Room[];

    constructor() {
        this.Rooms = [];
    }

    create(roomName: string, roomPass: string, creator: User) {
        if(this.getRoomByName(roomName) === null){
            var newRoom: Room = new Room(roomName, roomPass, creator);
            this.Rooms.push(newRoom);
            return newRoom;
        }else{
            //room with that name already exists
            return null;
        }

    }

    join(roomName: string, roomPass: string, user: User) {
        var room = this.getRoomByName(roomName);
        if(room === null){
            return null;
        }else{
            if(room.roomPassword === roomPass){
                
                room.userJoin(user);
                return room;
                
            }else{
                return null;
            }
        }
    }

    getRoomByName(name: string){
        var found: boolean = false;
        for(var i: number = 0; i < this.Rooms.length; i++ ){
            if(this.Rooms[i].roomName === name){
                found = true;
                return this.Rooms[i];
            }
        }
        return null;
    }

    getRoomById(id: string){
        for(var i: number = 0; i < this.Rooms.length; i++ ){
            if(this.Rooms[i].roomId === id){
                console.log("room found");
                return this.Rooms[i];
            }
        }
        console.log("room not found");
        return null;
    }

    getContributorsRoom(user: User){
        //check for contributor
        for(var i: number = 0; i < this.Rooms.length; i++ ){
            var roomContributors = this.Rooms[i].conotributors;
            for(var j : number = 0; j < roomContributors.length; j++){
                if(this.Rooms[i].conotributors[j].username === user.username){
                    return this.Rooms[i];
                }
            }
            
        }
        
        return null;
        
    }

    getAdminsRoom(user: User){
        //first check for admin
        for(var i: number = 0; i < this.Rooms.length; i++ ){
            if(this.Rooms[i].admin.username === user.username){
                return this.Rooms[i];
            }
        }

        return null;
        
    }

    test(){
        console.log("room list test");
    }
}