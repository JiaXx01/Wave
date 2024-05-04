import { Controller, Post, Body, UseGuards } from '@nestjs/common'
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
    return this.fileService.createFolder(userId, name, path)
  }
}
