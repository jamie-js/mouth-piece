import { Component, h } from '@stencil/core'

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})
export class AppRoot {
  render() {
    return (
      <ion-app>
        <ion-router useHash={false}>
          <ion-route url="/" component="app-home" />
          <ion-route url="/test" component="app-test" />

          <ion-route url="/add-recording" component="app-add-recording" />
          {/* <ion-route url="/edit-recording/:id" component="app-edit-recording" /> */}

          {/* <ion-route url="/profile/:name" component="app-profile" /> */}
        </ion-router>
        <ion-nav />
      </ion-app>
    )
  }
}
