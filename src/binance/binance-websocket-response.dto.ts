import { Expose } from 'class-transformer';
import { IsIn, IsInt, IsNumberString, IsString } from 'class-validator';

export class BinanceMiniTickerDto {
  @Expose({ name: 'e' })
  @IsIn(['24hrMiniTicker'])
  eventType!: string;

  @Expose({ name: 'E' })
  @IsInt()
  eventTime!: number;

  @Expose({ name: 's' })
  @IsString()
  symbol!: string;

  @Expose({ name: 'c' })
  @IsNumberString()
  closePrice!: string;

  @Expose({ name: 'o' })
  @IsNumberString()
  openPrice!: string;

  @Expose({ name: 'h' })
  @IsNumberString()
  highPrice!: string;

  @Expose({ name: 'l' })
  @IsNumberString()
  lowPrice!: string;

  @Expose({ name: 'v' })
  @IsNumberString()
  baseVolume!: string;

  @Expose({ name: 'q' })
  @IsNumberString()
  quoteVolume!: string;
}

