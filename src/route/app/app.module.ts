// import RoleGuard from '@guard/role.guard';
// import PluginModule from '@loader/loader.module';
import { tokenConstants } from '@common/c1-auth/token-constants';
import commonConstants from '@constant/common.constants';
import { ShareFunction } from '@helper/static-function';
import AQPMiddleware from '@interceptor/aqp/aqp.middleware';
import BotService from '@lazy-module/bots/bot.service';
import FcmModule from '@lazy-module/fcm/fcm.module';
import GlobalInstanceModule from '@lazy-module/global-instance/global-instance.module';
import CustomLoggerModule from '@lazy-module/logger/logger.module';
import MailerModule from '@lazy-module/mailer/mailer.module';
import RedisModule from '@lazy-module/redis/redis.module';
import S3Module from '@lazy-module/s3/s3.module';
import StorageModule from '@lazy-module/storage/storage.module';
import WebsocketCustomModule from '@lazy-module/websocket-custom/websocket-custom.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import CronModule from '../../lazy-module/cron/cron.module';
import V1Module from '../v1/v1.module';
import AppController from './app.controller';
import AppService from './app.service';

mongoosePaginate.paginate.options = {
  lean: true,
  limit: commonConstants.pagination.defaultLimit,
  page: commonConstants.pagination.defaultPage,
};

const arrayAppModule = [
  CustomLoggerModule,
  MongooseModule.forRoot(ShareFunction.env().MONGODB_URL as string, {
    // useCreateIndex: true,
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false,
    connectionFactory: (connection) => {
      connection.plugin(mongoosePaginate);
      return connection;
    },
  }),
  {
    ...JwtModule.register({
      secret: tokenConstants.secrets.accessToken,
    }),
    global: true,
  },
  RedisModule,
  MailerModule,
  S3Module,
  StorageModule,
  FcmModule,
  // PluginModule.registerPluginsAsync(),
  V1Module,
  GlobalInstanceModule,
  CronModule,
];

if (
  ShareFunction.isConfigRedis() &&
  ShareFunction.isConfigWebsocket() &&
  ShareFunction.isEnableWebsocket()
) {
  arrayAppModule.push(WebsocketCustomModule);
}

@Module({
  imports: arrayAppModule,
  controllers: [AppController],
  providers: [
    AppService,
    BotService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export default class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AQPMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
