
export default class Room{
    room_id: string;
    room_password: string;
    admin_id: string;
    clients: { key : string , value : WebSocket}[] = [];
    tracks: { id : string , title : string, user_id:string, uri: string}[] = [];
    constructor(room_id : string, room_password: string, admin_id: string){
        this.room_id = room_id;
        this.room_password = room_password;
        this.admin_id = admin_id;
        this.clients = [];
    }

    addClient(id: string, webSocket: WebSocket ){
        this.clients.push({key: id, value: webSocket});
    }

    removeClient(id: string){
        for( var i: number  = 0; i < this.clients.length; i++){
            console.log(this.clients[i].key);
            if(this.clients[i].key === id){
                this.clients.splice(i, 1);
                console.log("splice array for that user");
            }
        }
    }

    addTrack(track_id: string, track_title: string, userid: string , track_uri: string){
        this.tracks.push( { id: track_id, title: track_title, user_id: userid , uri: track_uri});
    }

    removeTrack(track_id: string){
        for( var i: number  = 0; i < this.tracks.length; i++){
            console.log(this.tracks[i].id);
            if(this.tracks[i].id === track_id){
                this.tracks.splice(i, 1);
            }
        }
    }
}