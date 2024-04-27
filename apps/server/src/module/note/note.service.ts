import { Inject, Injectable } from '@nestjs/common'
import { NoteRepository } from './note.repository'

@Injectable()
export class NoteService {
  @Inject()
  private note: NoteRepository

  async getNotes(userId: string) {
    return this.note.findUserNotes(userId)
  }

  async createNote(userId: string) {
    return this.note.create(userId)
  }

  async deleteNotes(userId: string, noteIds: string[]) {
    return this.note.delete(userId, noteIds)
  }
}
