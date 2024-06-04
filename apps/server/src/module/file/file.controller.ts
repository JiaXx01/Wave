import {
  Controller,
  Post,
  Body,
  UseGuards,
  Query,
  Get,
  Param,
  Delete,
  Put,
  Res,
  StreamableFile
} from '@nestjs/common'
import { FileService } from './file.service'
import { CreateFileDto, CreateFolderDto } from './dto/create-file.dto'
import { AuthGuard } from 'src/guard/auth.guard'
import { UserId } from 'src/custom.decorator'
import {
  DeleteFilesDto,
  RemoveFileDto,
  RenameFileDto
} from './dto/update-file.dto'
import { Response } from 'express'

@UseGuards(AuthGuard)
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  async createFile(@UserId() userId: string, @Body() fileInfo: CreateFileDto) {
    return await this.fileService.createFile(userId, fileInfo)
  }

  @Post('folder')
  async createFolder(
    @UserId() userId: string,
    @Body() { name, parentId }: CreateFolderDto
  ) {
    return await this.fileService.createFolder(userId, name, parentId)
  }

  @Get()
  async findFiles(
    @UserId() userId: string,
    @Query('folderId') folderId?: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number
  ) {
    return await this.fileService.findFiles(userId, folderId, skip, take)
  }

  @Get('presigned-url')
  async getUploadUrl(@Query('hash') hash: string) {
    return await this.fileService.getFileUploadUrl(hash)
  }

  @Get('chunk/presigned-url')
  async getChunkPresignedUrl(@Query('hashNo') hashNo: string) {
    return await this.fileService.getChunkPresignedUrl(hashNo)
  }

  @Post('chunk/merge')
  async mergeChunk(@UserId() userId: string, @Body() fileInfo: CreateFileDto) {
    return await this.fileService.mergeChunks(userId, fileInfo)
  }

  @Get('check/:hash')
  async checkHash(@Param('hash') hash: string) {
    return await this.fileService.checkHash(hash)
  }

  @Delete()
  async deleteFiles(@UserId() userId: string, @Body() { ids }: DeleteFilesDto) {
    return await this.fileService.deleteFiles(userId, ids)
  }

  @Delete('folder')
  async deleteFolders(
    @UserId() userId: string,
    @Body() { ids }: DeleteFilesDto
  ) {
    return await this.fileService.deleteFolders(userId, ids)
  }

  @Put(':id/name')
  async rename(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() { name }: RenameFileDto
  ) {
    this.fileService.rename(userId, id, name)
  }

  @Get('search')
  async searchKeyword(
    @UserId() userId: string,
    @Query('keyword') keyword: string
  ) {
    return await this.fileService.searchKeyword(userId, keyword)
  }

  @Get('folder-tree')
  async getFolderTree(@UserId() userId: string) {
    return await this.fileService.getFolderTree(userId)
  }

  @Put(':id/remove-to')
  async removeFile(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() { targetId }: RemoveFileDto
  ) {
    return await this.fileService.removeFile(userId, id, targetId)
  }

  @Get(':id/download-url')
  async getDownloadUrl(@UserId() userId: string, @Param('id') id: string) {
    return await this.fileService.getDownloadUrl(userId, id)
  }

  @Get(':id')
  async getFileContent(
    @UserId() userId: string,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const { file, stream } = await this.fileService.getFileStream(userId, id)
    res.set({
      'Content-Type': file.type,
      'Content-Length': file.size,
      'Content-Disposition': `filename="${file.name}"`
    })
    return new StreamableFile(stream)
  }
}
