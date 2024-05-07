import { Controller, Post, Body, UseGuards, Query, Get } from '@nestjs/common'
import { FileService } from './file.service'
import { CreateFolderDto } from './dto/create-file.dto'
import { AuthGuard } from 'src/guard/auth.guard'
import { UserId } from 'src/custom.decorator'

@UseGuards(AuthGuard)
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('folder')
  async createFolder(
    @UserId() userId: string,
    @Body() { name, path }: CreateFolderDto
  ) {
    return await this.fileService.createFolder(userId, name, path)
  }

  @Get()
  async findFiles(
    @UserId() userId: string,
    @Query('path') path: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number
  ) {
    return await this.fileService.findFiles(userId, path, skip, take)
  }

  @Get('presigned-url')
  async getUploadUrl(@UserId() userId: string, @Query('hash') hash: string) {
    return await this.fileService.getFileUploadUrl(userId, hash)
  }

  @Get('chunk/presigned-url')
  async getChunkPresignedUrl(@Query('hashNo') hashNo: string) {
    return await this.fileService.getChunkPresignedUrl(hashNo)
  }

  @Get('chunk/merge')
  async mergeChunk(@UserId() userId: string, @Query('hash') hash: string) {
    return await this.fileService.mergeChunks(userId, hash)
  }
}
