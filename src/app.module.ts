import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { RecordsModule } from './records/records.module';
import { Category} from './categories/entities/category.entity';
import { User } from './users/entities/user.entity';
import { Record } from './records/entities/record.entity';
import { AuthModule } from './auth/auth.module';
import { AppController } from "./app.controller";
import * as process from "process";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: Number(process.env.DB_PORT),
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DBNAME,
      entities: [Category, User, Record],
      synchronize: true,
    }),
    UsersModule,
    CategoriesModule,
    RecordsModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'),
      serveRoot: '/upload',
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
