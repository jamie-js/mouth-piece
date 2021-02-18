import { Component, h, State } from '@stencil/core'
import { Recording, Recordings } from '../../services/recordings'

@Component({
  tag: 'app-add-recording',
  styleUrl: 'app-add-recording.css',
})
export class AppAddRecording {
  @State() btnRecorderName: string = 'Record Voice'
  @State() btnRecorderColour: string = 'white'

  name: string = ''
  recorder
  gumStream
  data: string
  blobData: Blob
  timer = 0

  toggleRecording() {
    const player = document.getElementById('player') as HTMLAudioElement
    if (this.recorder && this.recorder.state == 'recording') {
      console.log('Stop')
      this.btnRecorderName = 'Record Voice'
      this.btnRecorderColour = 'white'
      this.recorder.stop()
      this.timer = Date.now() - this.timer
      //convert to seconds
      // this.timer = this.timer / 1000

      this.gumStream.getAudioTracks()[0].stop()
    } else {
      console.log('record')
      this.btnRecorderName = 'Recording...'
      this.btnRecorderColour = 'red'
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then(stream => {
          this.gumStream = stream
          this.recorder = new MediaRecorder(stream)
          this.recorder.ondataavailable = e => {
            this.blobData = e.data
            console.log(e.data)
            player.src = URL.createObjectURL(e.data)
          }

          this.recorder.start()
          this.timer = Date.now()
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
      data: this.data,
      progress: 100,
      duration: this.timer,
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
        <ion-grid>
          <ion-row class="ion-justify-content-center ion-align-items-center">
            <h3>Add a new recording to your collection</h3>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="stacked">Name</ion-label>
                <ion-input name="name" onInput={e => this.changeValue(e)} placeholder="e.g. My angelic voice note" type="text"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row class="ion-justify-content-center ion-align-items-center">
            <ion-col>
              <ion-button expand="full" onClick={() => this.toggleRecording()}>
                <ion-icon style={{ color: this.btnRecorderColour }} slot="start" name="mic-outline"></ion-icon>
                {this.btnRecorderName}
              </ion-button>
            </ion-col>
            <ion-col>
              <audio id="player" controls></audio>
            </ion-col>
          </ion-row>
          <ion-row class="ion-justify-content-center ion-align-items-center">
            <ion-col>
              <ion-button expand="full" onClick={() => this.createRecordingFile()}>
                Add New Recording
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-content>,
    ]
  }
}
