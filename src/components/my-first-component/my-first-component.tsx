import { Component, State, h, Prop, Watch, Host, Method } from '@stencil/core'

@Component({
  tag: 'my-first-component',
})
export class MyFirstComponent {
  //internal
  timer: number
  // todos:{ id: number, name: string }[] = [{"id": 1, "name": "Learn Stencil"}];
  todos = [
    { id: 1, name: 'Learn Stencil' },
    { id: 2, name: 'Make Stencil app' },
  ]

  //exposed publicly on the element.
  //Children components !reference parent components
  //Pass data down
  @Prop() myName: string = 'James'
  // @Prop({ mutable: false, attribute: 'name', reflect: false }) myName: string = "James"
  //mutable: Prop is by default immutable from INSIDE the component logic
  //attribute: set the DOM attribute name and allow non primative data types
  //reflect: keep a Prop in sync with an attribute

  //in HMTL
  //<my-first-component my-name="james"></my-first-component>

  // Any changes to a @State() property will cause the components render function to be called again
  //internal data for a component. cannot modify this data from outside the component. only use for data that needs to trigger re-render
  @State() time: number = Date.now()

  // does not fire when a component initially loads.
  //To update array or object data use map() or filter(), and the ES6 spread operator (...)
  @Watch('myName')
  validateName(newValue: string) {
    const isBlank = typeof newValue !== 'string' || newValue === ''
    if (isBlank) {
      throw new Error('name: required')
    }
  }

  //they are intended to be callable from the outside!
  //use publicly exposed methods as little as possible. instead default to using properties and events as much as possible
  //public methods are required to be async
  @Method()
  async showPrompt() {
    // show a prompt
  }

  connectedCallback() {
    this.timer = window.setInterval(() => {
      this.time = Date.now()
    }, 1000)
  }

  disconnectedCallback() {
    window.clearInterval(this.timer)
  }

  getText() {
    return <div>Text</div>
  }

  render() {
    const time = new Date(this.time).toLocaleTimeString()
    if (this.myName) {
      return (
        <Host>
          {this.getText()}

          <span>{time}</span>
          <p>My name is: {this.myName} </p>
          <slot></slot>
          {this.todos.map(todo => (
            <div>{todo.name}</div>
          ))}
        </Host>
      )
    } else {
      return (
        <div>
          <span>{time}</span>
        </div>
      )
    }
  }
}
