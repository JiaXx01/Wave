import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common'
import { NoteService } from './note.service'
import { AuthGuard } from 'src/guard/auth.guard'
import { UserId } from 'src/custom.decorator'
import { UpdateTitleDto } from './dto/update-note.dto'

type ParamId = {
  id: string
}

@UseGuards(AuthGuard)
@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  async getNotes(@UserId() userId: string) {
    return await this.noteService.getNotes(userId)
  }

  @Get(':id')
  async findNote(@UserId() userId: string, @Param() { id }: ParamId) {
    return await this.noteService.findNote(userId, id)
  }

  @Post()
  async create(@UserId() userId: string) {
    return await this.noteService.createNote(userId)
  }

  @Put(':id/title')
  async updateTitle(
    @UserId() userId: string,
    @Param() { id }: ParamId,
    @Body() { title }: UpdateTitleDto
  ) {
    await this.noteService.updateTitle(userId, id, title)
  }

  @Delete()
  async deleteNotes(@UserId() userId: string, @Query('ids') ids: string) {
    const noteIds = JSON.parse(ids)
    const res = await this.noteService.deleteNotes(userId, noteIds)
    return {
      message: '删除成功',
      res
    }
  }
}
