class SynthSpeechController {
  timer = 0
  private synth = window.speechSynthesis

  isSpeaking() {
    return this.synth.speaking
  }

  stop() {
    if (this.isSpeaking) {
      this.synth.cancel()
    }
  }

  async play(text, recording) {
    return new Promise(resolve => {
      if (this.synth.speaking) {
        resolve(false)
      }
      if (text !== '') {
        var utterThis = new SpeechSynthesisUtterance(text)
        utterThis.onerror = () => {
          console.error('SpeechSynthesisUtterance.onerror')
          resolve(false)
        }

        utterThis.onend = () => {
          this.timer = Date.now() - this.timer
          if (recording) {
            const event = new CustomEvent('synthCompleted', { detail: recording })
            window.dispatchEvent(event)
          }

          resolve(this.timer)
        }
        this.timer = Date.now()
        this.synth.speak(utterThis)
      }
    })
  }
}
export const SynthSpeech = new SynthSpeechController()
