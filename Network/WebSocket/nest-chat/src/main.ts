import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express'; // 익스프레스를 사용해서 정적 파일을 서비스할 수 있도록 설정 추가
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // NestExpressApplication의 인스턴스 생성
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'static')); // 정적 파일 경로 위치
  await app.listen(3000);
}
bootstrap();