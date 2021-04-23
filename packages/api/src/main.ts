import { NestFactory } from '@nestjs/core';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { FileLogger } from './file-logger';
import { setRestConfig } from './config/restConfig';

const RESTConfigurationFilePath = './restConfiguration.json';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new FileLogger() });
  const logger = new Logger('Main:bootstrap');

  // const options = new DocumentBuilder()
  //   .setTitle('eCMR Validator')
  //   .setDescription('The eCMR Validator API description')
  //   .setVersion('1.0')
  //   .addTag('ecmr')
  //   .addBearerAuth()
  //   .build();
  // const document = SwaggerModule.createDocument(app, options);
  // swagger path e.g. /subpath/swagger-specs is redirecting to /swagger-specs/ and not to /subpath/swagger-specs/
  // related bug: https://github.com/scottie1984/swagger-ui-express/issues/183
  // SwaggerModule.setup(process.env.SWAGGER_PATH || '/swagger', app, document);

  // app.enableCors({
  //   origin: true,
  // });

  await app.listen(process.env.PORT || 8083, process.env.HOSTNAME || '');

  fs.access(RESTConfigurationFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      logger.log('Configuration file was not found or could not be accessed. Using default config.');
      return;
    }
    fs.readFile(RESTConfigurationFilePath, (readErr, data) => {
      if (readErr) {
        if (readErr.code === 'ENOENT') {
          logger.error(`${RESTConfigurationFilePath} does not exist`);
          return;
        }
      }
      try {
        const restConfiguration = JSON.parse(data.toString());
        if (restConfiguration) {
          logger.log('Setting rest config');
          setRestConfig(restConfiguration);
        }
      } catch (jsonErr) {
        logger.log('An error happened while parsing the JSON rest configuration');
      }
    });
  });

  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
