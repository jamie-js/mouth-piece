import { Component, h, State } from '@stencil/core'
import { Recording, Recordings } from '../../services/recordings'
import { SynthSpeech } from '../../services/synthSpeech'
import { Helper } from '../../services/helper'

@Component({
  tag: 'app-add-recording',
  styleUrl: 'app-add-recording.css',
})
export class AppAddRecording {
  @State() btnRecorderName: string = 'Record Voice'
  @State() btnRecorderColour: string = 'white'
  @State() btnSynthRecorderName: string = 'Record Synth'
  @State() btnSynthRecorderColour: string = 'white'

  @State() text: string
  @State() data: string = ''
  @State() name: string = ''

  recorder
  gumStream
  audio: HTMLAudioElement

  timer: number = 0
  isSynth: boolean = false

  recordVoice() {
    if (this.recorder && this.recorder.state == 'recording') {
      this.btnRecorderName = 'Record Voice'
      this.btnRecorderColour = 'white'
      this.recorder.stop()
      this.timer = Date.now() - this.timer
      this.gumStream.getAudioTracks()[0].stop()
    } else {
      this.isSynth = false
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
            this.createRecordingFile(e.data)
          }

          this.recorder.start()
          this.timer = Date.now()
        })
    }
  }

  recordSynth() {
    this.btnSynthRecorderName = 'Recording...'
    this.btnSynthRecorderColour = 'red'

    SynthSpeech.play(this.text, null).then(duration => {
      this.timer = Number(duration)
      this.isSynth = true
      this.data = this.text
      this.btnSynthRecorderColour = 'white'
      this.btnSynthRecorderName = 'Record Synth'
    })
  }

  playRecording() {
    if (this.isSynth) {
      SynthSpeech.play(this.data, null)
    } else {
      this.playAudio()
    }
  }

  playAudio() {
    let blob = Helper.dataURItoBlob(this.data)
    let url = URL.createObjectURL(blob)
    this.audio = new Audio(url)

    this.audio.oncanplay = () => {
      if (this.audio) {
        this.audio.play()
      }
    }
  }

  createRecordingFile(data: Blob) {
    const reader = new FileReader()
    reader.onload = event => {
      this.data = event.target.result.toString()
      // this.addRecording()
    }
    reader.readAsDataURL(data)
  }

  async addRecording() {
    let recording: Recording = {
      id: Date.now(),
      name: this.name,
      data: this.data,
      progress: 100,
      duration: this.timer,
      isSynth: this.isSynth,
    }

    if (recording.name === '') {
      recording.name = recording.id.toString()
    }

    //wait for the new recording info to be added
    await Recordings.addRecording(recording)

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
      case 'text': {
        this.text = value
        break
      }
      case 'timer': {
        this.timer = value
        break
      }
      case 'data': {
        this.data = value
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
            <h2>Add a new recording to your collection</h2>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="stacked">Title</ion-label>
                <ion-input name="name" onInput={e => this.changeValue(e)} placeholder="e.g. My angelic voice note" type="text"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row color="red" class="ion-justify-content-center ion-align-items-center">
            <ion-col size="12">
              <h3>Record Your Voice</h3>
            </ion-col>
            <ion-col size="12">
              <ion-button style={{ color: this.btnSynthRecorderColour }} size="large" expand="full" onClick={() => this.recordVoice()}>
                <ion-icon style={{ color: this.btnRecorderColour }} slot="start" name="mic-outline"></ion-icon>
                {this.btnRecorderName}
              </ion-button>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="12">
              <h3>Record Synth Voice</h3>
            </ion-col>
            <ion-col size="12">
              <ion-item>
                <ion-label position="stacked">Enter Text</ion-label>
                <ion-input name="text" value={this.text} onInput={ev => this.changeValue(ev)} placeholder="What to say..." type="text"></ion-input>
              </ion-item>
            </ion-col>
            <ion-col size="12">
              <ion-button style={{ color: this.btnSynthRecorderColour }} onClick={() => this.recordSynth()} size="large" expand="full">
                <ion-icon style={{ color: this.btnSynthRecorderColour }} slot="start" name="invert-mode-outline"></ion-icon>
                {this.btnSynthRecorderName}
              </ion-button>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col>
              <h3>Playback Recording</h3>
            </ion-col>
            <ion-col size="12">
              <ion-button disabled={this.data === ''} size="large" expand="full" onClick={() => this.playRecording()}>
                Play Recording
              </ion-button>
            </ion-col>
          </ion-row>

          <ion-row class="ion-justify-content-center ion-align-items-center">
            <ion-col>
              <ion-button disabled={this.data === '' || this.name === ''} size="large" expand="full" onClick={() => this.addRecording()}>
                Add New Recording
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-content>,
    ]
  }
}
