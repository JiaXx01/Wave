import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets'
import { ChatService } from './chat.service'
import { CreateChatDto } from './dto/create-chat.dto'
import { UpdateChatDto } from './dto/update-chat.dto'

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    // methods: ['GET', 'POST'],
    allowedHeaders: ['*'],
    credentials: true
  }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: any, ...args: any[]) {
    console.log(client.id)
    console.log(args)
  }

  handleDisconnect(client: any) {
    console.log(client.id, 'disconnect')
  }

  @SubscribeMessage('createChat')
  create(@MessageBody() createChatDto: CreateChatDto) {
    console.log('jjjj')
    return this.chatService.create(createChatDto)
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll()
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id)
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id, updateChatDto)
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id)
  }
}
