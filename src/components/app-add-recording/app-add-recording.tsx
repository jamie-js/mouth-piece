import { Component, h, State } from '@stencil/core'
import { Recording, Recordings } from '../../services/recordings'

@Component({
  tag: 'app-add-recording',
  styleUrl: 'app-add-recording.css',
})
export class AppAddRecording {
  @State() btnRecorderName: string = 'Record Voice'

  name: string = ''
  location: string
  icon: string
  recorder
  gumStream
  recordingUrl: string
  data: string
  blobData: Blob
  // extension: string

  // componentDidLoad() {
  //   const recorder = document.getElementById('recorder') as HTMLInputElement
  //   const player = document.getElementById('player') as HTMLAudioElement

  //   recorder.addEventListener('change', function (e: Event) {
  //     console.log('event change')
  //     const file = (e.target as HTMLInputElement).files[0]
  //     const url = URL.createObjectURL(file)
  //     // // Do something with the audio file.
  //     player.src = url
  //   })

  //   if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
  //     this.extension = 'webm'
  //   } else {
  //     this.extension = 'ogg'
  //   }
  // }

  toggleRecording() {
    const player = document.getElementById('player') as HTMLAudioElement
    if (this.recorder && this.recorder.state == 'recording') {
      console.log('Stop')
      this.btnRecorderName = 'Record Voice'
      this.recorder.stop()
      this.gumStream.getAudioTracks()[0].stop()
    } else {
      console.log('record')
      this.btnRecorderName = 'Recording...'
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then(stream => {
          this.gumStream = stream
          this.recorder = new MediaRecorder(stream)
          this.recorder.ondataavailable = e => {
            this.blobData = e.data
            this.recordingUrl = URL.createObjectURL(e.data)
            player.src = this.recordingUrl
          }

          this.recorder.start()
        })
    }
  }

  createRecordingFile() {
    const reader = new FileReader()
    reader.onload = event => {
      // console.log(event)
      // console.log(event.target)
      // console.log(event.target.result)
      this.data = event.target.result.toString()
      this.addRecording()
      // localStorage.setItem("file", event.target.result);
    }
    reader.readAsDataURL(this.blobData)
  }

  async addRecording() {
    let recording: Recording = {
      id: Date.now(),
      name: this.name,
      location: this.location,
      icon: this.icon,
      data: this.data,
      url: this.recordingUrl,
      progress: 100,
    }

    console.log(recording.name)
    if (recording.name === '') {
      recording.name = recording.id.toString()
    }

    //wait for the new recording info to be added
    await Recordings.addRecording(recording)

    console.log('recording added')
    //return to the home screen
    const navCtrl = document.querySelector('ion-router')
    navCtrl.back()
  }

  changeValue(e) {
    const value = e.target.value

    switch (e.target.name) {
      case 'name': {
        this.name = value
        break
      }

      case 'icon': {
        this.icon = value
        break
      }
    }
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/"></ion-back-button>
          </ion-buttons>
          <ion-title>Add Recording</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        <p>Instructions</p>
        <ion-list>
          <ion-item>
            <ion-label position="stacked">Name</ion-label>
            <ion-input name="name" onInput={e => this.changeValue(e)} placeholder="e.g. My angelic voice note" type="text"></ion-input>
          </ion-item>
        </ion-list>
        <ion-button expand="full" onClick={() => this.toggleRecording()}>
          {this.btnRecorderName}
        </ion-button>

        <ion-button expand="full" onClick={() => this.createRecordingFile()}>
          Add New Recording
        </ion-button>

        <audio id="player" controls></audio>
      </ion-content>,
    ]
  }
}
