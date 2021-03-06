/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface AppAddRecording {
    }
    interface AppHome {
    }
    interface AppRoot {
    }
    interface AppTest {
    }
    interface MyFirstComponent {
        "myName": string;
        "showPrompt": () => Promise<void>;
    }
}
declare global {
    interface HTMLAppAddRecordingElement extends Components.AppAddRecording, HTMLStencilElement {
    }
    var HTMLAppAddRecordingElement: {
        prototype: HTMLAppAddRecordingElement;
        new (): HTMLAppAddRecordingElement;
    };
    interface HTMLAppHomeElement extends Components.AppHome, HTMLStencilElement {
    }
    var HTMLAppHomeElement: {
        prototype: HTMLAppHomeElement;
        new (): HTMLAppHomeElement;
    };
    interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {
    }
    var HTMLAppRootElement: {
        prototype: HTMLAppRootElement;
        new (): HTMLAppRootElement;
    };
    interface HTMLAppTestElement extends Components.AppTest, HTMLStencilElement {
    }
    var HTMLAppTestElement: {
        prototype: HTMLAppTestElement;
        new (): HTMLAppTestElement;
    };
    interface HTMLMyFirstComponentElement extends Components.MyFirstComponent, HTMLStencilElement {
    }
    var HTMLMyFirstComponentElement: {
        prototype: HTMLMyFirstComponentElement;
        new (): HTMLMyFirstComponentElement;
    };
    interface HTMLElementTagNameMap {
        "app-add-recording": HTMLAppAddRecordingElement;
        "app-home": HTMLAppHomeElement;
        "app-root": HTMLAppRootElement;
        "app-test": HTMLAppTestElement;
        "my-first-component": HTMLMyFirstComponentElement;
    }
}
declare namespace LocalJSX {
    interface AppAddRecording {
    }
    interface AppHome {
    }
    interface AppRoot {
    }
    interface AppTest {
    }
    interface MyFirstComponent {
        "myName"?: string;
    }
    interface IntrinsicElements {
        "app-add-recording": AppAddRecording;
        "app-home": AppHome;
        "app-root": AppRoot;
        "app-test": AppTest;
        "my-first-component": MyFirstComponent;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "app-add-recording": LocalJSX.AppAddRecording & JSXBase.HTMLAttributes<HTMLAppAddRecordingElement>;
            "app-home": LocalJSX.AppHome & JSXBase.HTMLAttributes<HTMLAppHomeElement>;
            "app-root": LocalJSX.AppRoot & JSXBase.HTMLAttributes<HTMLAppRootElement>;
            "app-test": LocalJSX.AppTest & JSXBase.HTMLAttributes<HTMLAppTestElement>;
            "my-first-component": LocalJSX.MyFirstComponent & JSXBase.HTMLAttributes<HTMLMyFirstComponentElement>;
        }
    }
}
