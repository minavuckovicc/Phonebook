import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/services/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "http://localhost:4200",
  });
  await app.get(AuthService).ensureDefaultAdmin();
  await app.listen(3000);
}
bootstrap();
