
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
        for( var i: number  = 0; i < this.clients.length; i++){
            console.log(this.clients[i].key);
            if(this.clients[i].key === id){
                this.clients.splice(i, 1);
                console.log("splice array for that user");
            }
        }
    }
}