import { Inject, Injectable } from '@nestjs/common'
import { NoteRepository } from './note.repository'

@Injectable()
export class NoteService {
  @Inject()
  private note: NoteRepository

  async getNotes(userId: string) {
    return this.note.findUserNotes(userId)
  }

  async findNote(userId: string, noteId: string) {
    return this.note.findUserNote(userId, noteId)
  }

  async createNote(userId: string) {
    return this.note.create(userId)
  }

  async updateTitle(userId: string, noteId: string, title: string) {
    return this.note.updateTitle(userId, noteId, title)
  }

  async deleteNotes(userId: string, noteIds: string[]) {
    return this.note.delete(userId, noteIds)
  }
}
