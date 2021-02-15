import { get, set } from './storage'

export interface Recording {
  id: number
  name?: string
  location?: string
  icon?: string
  data: string
  url: string
  progress: number
}

class RecordingsController {
  private savedRecordings = 'savedRecordings'
  async addRecording(recording: Recording): Promise<void> {
    let recordings = (await get(this.savedRecordings)) || []
    recordings.push(recording)

    await set(this.savedRecordings, recordings)
  }

  async removeRecording(recording): Promise<void> {
    let recordings = await get(this.savedRecordings)
    var removeIndex = recordings
      .map(function (item) {
        return item.id
      })
      .indexOf(recording.id)

    recordings.splice(removeIndex, 1)

    await set(this.savedRecordings, recordings)
  }

  async getRecordings(): Promise<any> {
    let recordings = await get(this.savedRecordings)

    if (recordings === null) {
      return []
    } else {
      return recordings
    }
  }
}
//this creates the singleton
export const Recordings = new RecordingsController()
