import { Controller, Get, Post, UseGuards } from '@nestjs/common'
import { NoteService } from './note.service'
import { AuthGuard } from 'src/guard/auth.guard'
import { UserId } from 'src/custom.decorator'

@UseGuards(AuthGuard)
@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  async getNotes(@UserId() userId: string) {
    return await this.noteService.getNotes(userId)
  }

  @Post()
  async create(@UserId() userId: string) {
    return await this.noteService.createNote(userId)
  }
}
