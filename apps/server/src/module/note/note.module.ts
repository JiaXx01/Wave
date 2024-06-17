import { Module } from '@nestjs/common'
import { NoteService } from './note.service'
import { NoteController } from './note.controller'
import { NoteRepository } from '../../repository/note.repository'

@Module({
  controllers: [NoteController],
  providers: [NoteService, NoteRepository]
})
export class NoteModule {}
