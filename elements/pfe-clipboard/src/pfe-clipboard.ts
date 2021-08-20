import { PFElement, html } from "@patternfly/pfelement";
import styles from "pfe-clipboard.scss";

export class PfeClipboard extends PFElement {
  static styles = styles;

  static get tag() {
    return "pfe-clipboard";
  }

  static get meta() {
    return {
      title: "Clipboard",
      description: "Copy current URL to clipboard.",
    };
  }

  static get events() {
    return {
      copied: `${this.tag}:copied`,
    };
  }

  // Declare the type of this component
  static get PfeType() {
    return PFElement.PfeTypes.Content;
  }

  static get slots() {
    return {
      icon: {
        title: "Icon",
        description: "This field can accept an SVG, pfe-icon component, or other format for displaying an icon.",
        slotName: "icon",
        slotClass: "pfe-clipboard__icon",
        slotId: "icon",
      },
      text: {
        title: "Default text",
        slotName: "text",
        slotClass: "pfe-clipboard__text",
        slotId: "text",
      },
      textSuccess: {
        title: "Success message",
        description: "Shown when the URL is successfully copied to the clipboard.",
        slotName: "text--success",
        slotClass: "pfe-clipboard__text--success",
        slotId: "text--success",
      },
    };
  }

  static get properties() {
    return {
      noIcon: {
        title: "No icon",
        type: Boolean,
        attribute: "no-icon"
      },
      copiedDuration: {
        title: "Success message duration (in seconds)",
        type: Number,
        attribute: "copied-duration"
      },
      role: {
        type: String,
        reflect: true
      },
      tabindex: {
        type: Number,
        reflect: true
      },
    };
  }

  constructor() {
    super();
    this.noIcon = false;
    this.copiedDuration = 3;
    this.copiedDuration = 3;
    this.role = "button";
    this.tabindex = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    // Since this element as the role of button we are going to listen
    // for click and as well as 'enter' and 'space' commands to trigger
    // the copy functionality
    this.addEventListener("click", this._clickHandler.bind(this));
    this.addEventListener("keydown", this._keydownHandler.bind(this));
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._clickHandler.bind(this));
    this.removeEventListener("keydown", this._keydownHandler.bind(this));
    super.disconnectedCallback();
  }

  _clickHandler(event) {
    // Execute the copy to clipboard functionality
    this.copyURLToClipboard()
      .then((url) => {
        // Emit event that lets others know the user has "copied"
        // the url. We are also going to include the url that was
        // copied.
        this.emitEvent(PfeClipboard.events.copied, {
          detail: {
            url,
          },
        });
        // Toggle the copied state. Use the this._formattedCopiedTimeout function
        // to an appropraite setTimout length.
        this.setAttribute("copied", "");
        setTimeout(() => {
          this.removeAttribute("copied");
        }, this._formattedCopiedTimeout());
      })
      .catch((error) => {
        this.warn(error);
      });
  }

  // Formatted copied timeout value. Use the formattedCopiedTimeout function
  // to get a type safe, millisecond value of the timeout duration.
  _formattedCopiedTimeout() {
    const copiedDuration = Number(this.copiedDuration * 1000);
    if (!(copiedDuration > -1)) {
      this.warn(`copied-duration must be a valid number. Defaulting to 3 seconds.`);
      // default to 3 seconds
      return 3000;
    } else {
      return copiedDuration;
    }
  }

  // Listen for keyboard events and map them to their
  // corresponding mouse events.
  _keydownHandler(event) {
    let key = event.key || event.keyCode;
    switch (key) {
      case "Enter" || 13:
        this._clickHandler(event);
        break;
      case " " || 32:
        // Prevent the browser from scolling when the user hits the space key
        event.stopPropagation();
        event.preventDefault();
        this._clickHandler(event);
        break;
    }
  }

  /**
   * Copy url to the user's system clipboard
   *
   * If available, it will use the new Navigator API to access the system clipboard
   * https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard
   *
   * If unavailable, it will use the legacy execCommand("copy")
   * https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
   * @async
   * @return {Promise<string>} url
   */
  copyURLToClipboard() {
    return new Promise((resolve, reject) => {
      const url = window.location.href;
      // If the Clipboard API is available then use that
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(resolve(url));
      }
      // If execCommand("copy") exists then use that method
      else if (document.queryCommandEnabled("copy")) {
        const dummy = document.createElement("input");
        document.body.appendChild(dummy);
        dummy.value = url;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        resolve(url);
      } else {
        reject(new Error("Your browser does not support copying to the clipboard."));
      }
    });
  }

  render() {
    return html`
    <!-- icon slot -->
    ${!this.noIcon ? html`
      <div class="pfe-clipboard__icon">
          <slot name="icon" id="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 15.277 16"><g transform="translate(-2.077 -1.807)"><path class="a" d="M15.34,2.879a3.86,3.86,0,0,0-5.339,0L6.347,6.545a3.769,3.769,0,0,0,0,5.339.81.81,0,0,0,1.132,0,.823.823,0,0,0,0-1.145A2.144,2.144,0,0,1,7.5,7.677l3.641-3.654a2.161,2.161,0,1,1,3.049,3.062l-.8.8a.811.811,0,1,0,1.145,1.132l.8-.8a3.769,3.769,0,0,0,0-5.339Z" transform="translate(0.906 0)"/><path class="a" d="M10.482,6.822a.823.823,0,0,0,0,1.145,2.161,2.161,0,0,1,0,3.049L7.343,14.155a2.161,2.161,0,0,1-3.062,0,2.187,2.187,0,0,1,0-3.062l.193-.116a.823.823,0,0,0,0-1.145.811.811,0,0,0-1.132,0l-.193.193a3.86,3.86,0,0,0,0,5.339,3.86,3.86,0,0,0,5.339,0l3.126-3.139A3.731,3.731,0,0,0,12.72,9.562a3.769,3.769,0,0,0-1.094-2.74A.823.823,0,0,0,10.482,6.822Z" transform="translate(0 1.37)"/></g></svg>
          </slot>
      </div>
    ` : ""}
    <div class="pfe-clipboard__text">
      <slot name="text" id="text">Copy URL</slot>
    </div>
    <div class="pfe-clipboard__text--success" role="alert">
      <slot name="text--success" id="text--success">Copied</slot>
    </div>
    `;
  }
}

PFElement.create(PfeClipboard);