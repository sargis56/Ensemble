
export default class Room{
    room_id: string;
    clients: { key : string , value : WebSocket}[] = [];
    constructor(room_id : string){
        this.room_id = room_id;
        this.clients = [];
    }

    addClient(id: string, webSocket: WebSocket ){
        this.clients.push({key: id, value: webSocket});
    }

    removeClient(id: string){
        var index = -1;
        if (index > -1) {
            // this.clients.splice(index, 1);
            console.log("removed client with id", id);
        }else{
            console.log("could not remove client with id of", id);
        }
    }
}