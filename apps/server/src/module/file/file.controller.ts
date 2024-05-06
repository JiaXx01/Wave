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

  @Get('uploadUrl')
  async getUploadUrl(
    @UserId() userId: string,
    @Query('name') name: string,
    @Query('path') path: string
  ) {
    return await this.fileService.getUploadUrl(userId, name, path)
  }
}
