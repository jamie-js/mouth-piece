import { Component, h, State } from '@stencil/core'
import { Recording, Recordings } from '../../services/recordings'
import { SynthSpeech } from '../../services/synthSpeech'
import { Helper } from '../../services/helper'

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
})
export class AppHome {
  @State() recordings: Recording[] = []
  @State() progress: number = 100
  @State() text: string

  audio: HTMLAudioElement
  animateLabelInterval: any

  componentDidLoad() {
    const router = document.querySelector('ion-router')

    // Refresh data every time view is entered
    router.addEventListener('ionRouteDidChange', async () => {
      const recordings = await Recordings.getRecordings()
      this.recordings = [...recordings]
    })

    //listen for synth to finish talking
    window.addEventListener('synthCompleted', (e: CustomEvent) => {
      this.synthCompleted(e.detail)
    })
  }

  //#region playback
  onClickRecording(recording) {
    if (this.audio) {
      // console.log('audio playing')
      this.stopAudio(recording)
    }

    if (SynthSpeech.isSpeaking()) {
      // console.log('synth talking')
      this.stopSynth(recording)
    }

    if (recording.isSynth) {
      this.playSynth(recording)
    } else {
      this.playAudio(recording)
    }
  }

  playSynth(recording) {
    // this.speak(recording.data, recording)
    SynthSpeech.play(recording.data, recording)
    this.progress = 100
    recording.progress = this.progress
    this.animateLabel(recording)
  }

  playAudio(recording) {
    let blob = Helper.dataURItoBlob(recording.data)
    let url = URL.createObjectURL(blob)
    this.audio = new Audio(url)

    this.audio.onended = () => {
      this.stopAudio(recording)
    }

    this.audio.oncanplay = () => {
      if (this.audio) {
        this.audio.play()
        this.progress = 100
        recording.progress = this.progress
        this.animateLabel(recording)
      }
    }
  }

  stopSynth(recording) {
    SynthSpeech.stop()
    this.progress = 100
    recording.progress = this.progress
    clearInterval(this.animateLabelInterval)
  }

  stopAudio(recording) {
    this.audio.pause()
    this.audio.currentTime = 0
    this.audio = null

    this.progress = 100
    recording.progress = this.progress

    clearInterval(this.animateLabelInterval)
  }
  //#endregion playback

  //#region events
  animateLabel(recording) {
    if (this.audio) {
      //playing audio
      let duration = recording.duration / 1000
      this.animateLabelInterval = setInterval(() => {
        let percentage = this.audio.currentTime / duration

        this.progress = 100 - Math.floor(percentage * 100)

        recording.progress = this.progress
      }, 50)
    } else {
      //playing synth
      let start = Date.now()

      this.animateLabelInterval = setInterval(() => {
        let percentage = (Date.now() - start) / recording.duration
        this.progress = 100 - Math.floor(percentage * 100)

        recording.progress = this.progress
      }, 50)
    }
  }

  changeValue(ev) {
    const value = ev.target.value

    switch (ev.target.name) {
      case 'text': {
        this.text = value
        break
      }
    }
  }

  synthCompleted(recording: Recording) {
    this.stopSynth(recording)
  }

  async deleteRecording(recording) {
    const list = document.querySelector('ion-list')
    await Recordings.removeRecording(recording)
    const recordings = await Recordings.getRecordings()
    this.recordings = [...recordings]
    list.closeSlidingItems()
  }
  //#endregion events

  onTextToSpeech() {
    SynthSpeech.play(this.text, null)
  }

  renderWelcomeMessage() {
    return (
      <div>
        {!this.recordings.length ? (
          <div class="message">
            <p>No recordings! Add some with the plus button at the top or try the text to speech option below</p>
          </div>
        ) : null}
      </div>
    )
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Mouth Piece</ion-title>
          <ion-buttons slot="end">
            <ion-button href="/add-recording" routerDirection="forward">
              <ion-icon slot="icon-only" name="add"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        {this.renderWelcomeMessage()}

        <ion-list class="list-speech" lines="none">
          {this.recordings.map(recording => (
            <ion-item-sliding>
              <ion-item button onClick={() => this.onClickRecording(recording)}>
                <ion-label style={{ background: `linear-gradient(to left, #00a6ff ${recording.progress}%, #00ff99 0%)` }} class="label-recording">
                  {recording.name}
                </ion-label>
                {/* <div>{recording.progress}</div> */}
              </ion-item>
              <ion-item-options>
                <ion-item-option color="danger">
                  <ion-icon onClick={() => this.deleteRecording(recording)} slot="icon-only" name="trash"></ion-icon>
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>
          ))}
        </ion-list>

        <div class="text-speech">
          <ion-item>
            <ion-label position="stacked">Enter Text</ion-label>
            <ion-input name="text" value={this.text} onInput={ev => this.changeValue(ev)} placeholder="What to say..." type="text"></ion-input>
          </ion-item>
          <ion-button size="large" expand="full" onClick={() => this.onTextToSpeech()}>
            Play
          </ion-button>
          {/* <ion-button disabled={!this.canSave} size="large" expand="full" onClick={() => this.onSaveText()}>
            Save
          </ion-button> */}
          <ion-button size="large" expand="full" onClick={() => (this.text = '')}>
            Clear
          </ion-button>
          <p class="version-text">v0.0.5</p>
        </div>
      </ion-content>,
    ]
  }
}
