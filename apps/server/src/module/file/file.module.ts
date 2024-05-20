import { Module } from '@nestjs/common'
import { FileService } from './file.service'
import { FileController } from './file.controller'
import { FileRepository } from './file.repository'
import * as Minio from 'minio'

@Module({
  controllers: [FileController],
  providers: [
    FileService,
    FileRepository,
    {
      provide: 'MinioModule',
      async useFactory() {
        const client = new Minio.Client({
          endPoint: process.env.MINIO_HOST!,
          port: Number(process.env.MINIO_PORT),
          useSSL: false,
          accessKey: process.env.MINIO_ACCESS_KEY!,
          secretKey: process.env.MINIO_SECRET_KEY!
        })
        return client
      }
    }
  ]
  // exports: ['MinioModule']
})
export class FileModule {}
