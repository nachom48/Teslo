import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedClients {
    [id: string]: Socket
}

// { Esto es reemplazado por la interfaz de ConnectedClients
//     'asadada':socket,
//     'asadada':socket,
//     'asadada':socket,
//     'asadada':socket,
//     'asadada':socket,
// }

@Injectable()
export class MessagesWsService {


    private connectedClients: ConnectedClients = {}


    //Cuando se conecta
    registerClient(client: Socket) {
        this.connectedClients[client.id] = client;
    }

    //cuando se desconecta
    removeClient(clientId: string) {
        delete this.connectedClients[clientId]
    }

    getConnectedClients(): string[] {
        return Object.keys(this.connectedClients);
    }


    

}
