import Room from './Room';

export default class Rooms{
    roomList : any = {};

    constructor(){

    }

    addRoom(room_id: string, room_password:string, user_id: string){
        if (this.roomList[room_id] === undefined) {
            var newRoom: Room = new Room(room_id, room_password, user_id); 
            this.roomList[room_id] =  newRoom ;
            console.log("room list",this.roomList);
            return room_id;
        }else{
            return false;
            //room exists
        }
    }

    joinRoom(room_id: string, room_password:string){
        if (this.roomList[room_id] === undefined) {
            return false;
        }else{
            if(this.roomList[room_id].room_password == room_password){
                return true;
            }else{
                return false;
            }
        }
    }

    removeRoom(room_id: string){
        
        if (this.roomList[room_id] != undefined) {
            //this.roomList.splice(, 1);
            console.log("removed room with id", room_id);
        }else{
            console.log("could not remove room with id of", room_id);
        }
    }
    
    getRoomClients(room_id: string){
        
        if (this.roomList[room_id]) {
            console.log("retreived room clients from room with id", room_id);
            return this.roomList[room_id].clients;
        }else{
            this.addRoom
            console.log("could not get clients for room with id of", room_id);
            return null;
        }
    }
    
    addClient(room_id:string, user_id: string, ws: WebSocket){
        if (this.roomList[room_id] != undefined) {
            this.roomList[room_id].addClient(user_id, ws);
            console.log("added client to room with id", room_id);
            console.log("room list",this.roomList);

            return true;
        }else{
            // this.addRoom(room_id);
            /*
            this.roomList[room_id].addClient(user_id, ws);
            console.log("added client to a new room with id of", room_id);
            console.log("room list",this.roomList);*/
            return false;
        }
    }

    removeClient(room_id: string, user_id: string){
        
        if (this.roomList[room_id] != undefined) {
            this.roomList[room_id].removeClient(user_id);
            console.log("removed client from room with id", user_id);
            return true;
        }else{
            console.log("could not remove user from room with id", room_id);
            return true;
        }
    }

    addSong(room_id: string, user_id:string, track_id: string, track_title:string, track_uri: string){
        if (this.roomList[room_id] != undefined) {
            this.roomList[room_id].addTrack(track_id, track_title, user_id, track_uri);
            console.log("added song");
            return true;
        }else{
            console.log("could not add song");
            return true;
        }
    }

    getRoomPlaylist(room_id: string){
        if (this.roomList[room_id] != undefined) {
            return this.roomList[room_id].tracks;
        }else{
            console.log("could not get playlist");
            return true;
        }
    }

    getRoomAdmin(room_id: string){
        if (this.roomList[room_id] != undefined) {
            return this.roomList[room_id].tracks;
        }else{
            console.log("could not get playlist");
            return false;
        }
    }
}