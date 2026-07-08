import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { BinanceMiniTickerDto } from './binance-websocket-response.dto';

@WebSocketGateway({ path: '/ws' })
export class BinanceWebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server!: Server;

  private clients = new Set<WebSocket>();

  handleConnection(client: WebSocket) {
    this.clients.add(client);
  }

  handleDisconnect(client: WebSocket) {
    this.clients.delete(client);
  }

  broadcast(data: BinanceMiniTickerDto) {
    const precio = data.closePrice;
    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(precio);
      }
    }
  }
}
