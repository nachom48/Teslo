import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io'
import { NewMessageDto } from './dtos/newMessage.dto';


@WebSocketGateway({ cors: true })
//implmentando esas dos interfaces, de OnGateWayConnection y OnGatewayDisconnect sabemos cuando un cliente se conecta o se desconecta
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(private readonly messagesWsService: MessagesWsService) { }

  handleConnection(client: Socket) {
    this.messagesWsService.registerClient(client);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client:Socket,payload:NewMessageDto) {
    //messages-from-server
    client.emit('message-from-server',{fullName:'Soy yo!',message:payload.message || 'no-message!'})
  }
}
