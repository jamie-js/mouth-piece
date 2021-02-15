import { Component, h } from '@stencil/core'

@Component({
  tag: 'app-test',
  styleUrl: 'app-test.css',
})
export class AppTest {
  render() {
    return <div class="test-div">test</div>
  }
}
