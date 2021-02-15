import { Component, h, State } from '@stencil/core'
import { Recording, Recordings } from '../../services/recordings'

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
})
export class AppHome {
  @State() recordings: Recording[] = []
  @State() progress: number = 100
  @State() text: string

  // text: string
  audio: HTMLAudioElement
  animateLabelInterval: any
  duration = 0
  synth = window.speechSynthesis

  componentDidLoad() {
    const router = document.querySelector('ion-router')

    // Refresh data every time view is entered
    router.addEventListener('ionRouteDidChange', async () => {
      const recordings = await Recordings.getRecordings()
      this.recordings = [...recordings]
    })
  }

  async deleteRecording(recording) {
    const list = document.querySelector('ion-list')

    console.log('delete recording')
    console.log(recording)
    await Recordings.removeRecording(recording)
    const recordings = await Recordings.getRecordings()
    this.recordings = [...recordings]

    list.closeSlidingItems()
  }

  stopAudio(recording) {
    this.audio.pause()
    this.audio.currentTime = 0
    this.audio = null

    this.progress = 100
    recording.progress = this.progress

    clearInterval(this.animateLabelInterval)
  }

  playAudio(recording) {
    let blob = this.dataURItoBlob(recording.data)
    let url = URL.createObjectURL(blob)
    this.audio = new Audio(url)

    this.audio.onended = () => {
      console.log('sound ended')
      this.stopAudio(recording)
    }

    this.audio.oncanplay = () => {
      if (this.audio) {
        console.log('sound play')
        this.audio.play()
      }
    }

    this.audio.ondurationchange = () => {
      if (this.audio.duration != Infinity) {
        console.log('sound duration')
        console.log(this.audio.duration)
        this.duration = this.audio.duration
        //can only animate the label once we know the duration
        this.progress = 100
        recording.progress = this.progress
        this.animateLabel(recording)
      }
    }
  }

  animateLabel(recording) {
    this.animateLabelInterval = setInterval(() => {
      let percentage = this.audio.currentTime / this.duration

      this.progress = 100 - Math.floor(percentage * 100)

      recording.progress = this.progress
    }, 50)
  }

  onClickRecording(recording) {
    if (this.audio) {
      this.stopAudio(recording)
    } else {
      this.playAudio(recording)
    }
  }

  onTextToSpeech() {
    this.speak(this.text)
  }

  speak(text) {
    if (this.synth.speaking) {
      console.error('speechSynthesis.speaking')
      return
    }
    if (text !== '') {
      var utterThis = new SpeechSynthesisUtterance(text)
      utterThis.onend = () => {
        console.log('SpeechSynthesisUtterance.onend')
      }
      utterThis.onerror = () => {
        console.error('SpeechSynthesisUtterance.onerror')
      }

      this.synth.speak(utterThis)
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

  dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataURI.split(',')[1])

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var arrayBuffer = new ArrayBuffer(byteString.length)
    var _ia = new Uint8Array(arrayBuffer)
    for (var i = 0; i < byteString.length; i++) {
      _ia[i] = byteString.charCodeAt(i)
    }

    var dataView = new DataView(arrayBuffer)
    var blob = new Blob([dataView], { type: mimeString })
    return blob
  }

  renderWelcomeMessage() {
    return (
      <div>
        {!this.recordings.length ? (
          <div class="message">
            <p>No recordings! Add instructions here!</p>
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
          <ion-button expand="full" onClick={() => this.onTextToSpeech()}>
            Play
          </ion-button>
          <ion-button expand="full" onClick={() => (this.text = '')}>
            Clear
          </ion-button>
        </div>

        <p>v0.0.2</p>
      </ion-content>,
    ]
  }
}
