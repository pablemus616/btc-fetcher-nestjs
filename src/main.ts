import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger, ValidationPipe } from '@nestjs/common';
import fastifyHelmet from '@fastify/helmet';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const logger: Logger = new Logger("Boostrap");
  const app = await NestFactory.create<NestFastifyApplication>(MainModule, new FastifyAdapter());
  await app.register(fastifyHelmet);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }));
  app.setGlobalPrefix("/api/v1");
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  logger.log(`App listening on ${await app.getUrl()}`);
}
bootstrap();
