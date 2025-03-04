import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default async function Swagger(app: any, pathName: string = 'docs') {
  const options = new DocumentBuilder()
    .setTitle('Task Scheduler')
    .setDescription('API Service')
    .addTag(`Training`)
    .setVersion('1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(pathName, app, document);
}
