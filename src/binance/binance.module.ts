import { Module } from '@nestjs/common';
import { BinanceWebsocketGateway } from './binance-websocket.gateway';
import { BinanceWebsocketProvider } from './binance-websocket.provider';

@Module({
  providers: [BinanceWebsocketGateway, BinanceWebsocketProvider]
})
export class BinanceModule {}
