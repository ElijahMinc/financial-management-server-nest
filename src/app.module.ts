import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    UserModule,
    CategoryModule,
    AuthModule,
    TransactionModule,
    ConfigModule.forRoot({
      isGlobal: true, // мы определяем .env переменные глобально для всего проекта
    }),
    TypeOrmModule.forRootAsync({
      // так как нам нужно будет подключить несколько модулей, то мы вызываем forRootAsync
      imports: [ConfigModule],
      inject: [ConfigService], // чтобы использовать внутри useFactory переменные, мы должны заинжектить ConfigService
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: true,
        entities: [__dirname + '/**/*.entity{.js, .ts}'], //сюда будут подключаться все модели для базы данных
      }),
    }),
  ],
  controllers: [AppController], // роуты приложения
  providers: [AppService], // логика приложения
})
export class AppModule {}
