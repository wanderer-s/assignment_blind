import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setSwaggerConfig = (app: NestExpressApplication) => {
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().build(),
  );

  SwaggerModule.setup(
    'api-docs',
    app,
    SwaggerModule.createDocument(app, document),
  );
};
