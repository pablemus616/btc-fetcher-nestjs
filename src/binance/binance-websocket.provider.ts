import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import WebSocket from 'ws';

import { BinanceWebsocketGateway } from './binance-websocket.gateway';
import { BinanceMiniTickerDto } from './binance-websocket-response.dto';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class BinanceWebsocketProvider implements OnModuleInit, OnModuleDestroy {
  private upstream: WebSocket;
  private logger: Logger = new Logger(BinanceWebsocketProvider.name);
  private timer : NodeJS.Timeout;
  constructor(private readonly gateway: BinanceWebsocketGateway) {
  }

  onModuleInit() {
    this.connect();
  }
  onModuleDestroy() {
    if(this.timer) clearTimeout(this.timer);
    this.upstream.close();
  }

  private connect(){
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
    this.upstream = new WebSocket(
      'wss://stream.binance.com:9443/ws/btcusdt@miniTicker',
    );

    this.upstream.on("open", () => {
      this.logger.log("Conectado a binance");
    });

    this.upstream.on("message", (msg: WebSocket.RawData) => {
      const jsonParsed = JSON.parse(msg.toString());
      const dto = plainToInstance(BinanceMiniTickerDto, jsonParsed, {
        excludeExtraneousValues: true,
      });
      this.gateway.broadcast(dto);
    });

    this.upstream.on("error", (error) => {
        this.logger.error(`Error en websocket ${error}`);
    });

    this.upstream.on("close", () => {
      this.logger.warn("Conexion a binance cerrada, reintentando en 2 segundos...");
      this.timer = setTimeout(() => this.connect(), 2000);
    });
  }

}