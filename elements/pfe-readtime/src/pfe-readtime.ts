import { PFElement, html } from "@patternfly/pfelement";
import { PropertyValues } from "lit";
import styles from "pfe-readtime.scss";

function getEstimatedWPM(language:string):number {
  switch (language) {
    case "en": // 228 wpm
    case "ko": // for Korean, we were able to locate 7 studies in five articles: 5 with silent reading and 2 with reading aloud. Silent reading rate was 226 wpm, reading aloud 133 wpm.
      return 228;
    case "zh": // 158 wpm
      return 158;
    case "fr": // 195 wpm
      return 195;
    case "ja": // 193 wpm
      return 193;
    case "de":
      return 179;
    case "it": // 188 wpm
      return 188;
    case "pt-br": // 181 wpm
      return 181;
    case "es":
      return 218;
    default:
      return 228;
  }
}

export class PfeReadtime extends PFElement {
  static styles = styles;
  private _lang: string = document.documentElement.lang || "en";
  wordCount: Number = 0;
  wpm: Number = getEstimatedWPM(this._lang);
  templateString: string = "%t-minute readtime";
  for: any;

  static get tag() {
    return "pfe-readtime";
  }

  static get properties() {
    return {
      wpm: {
        type: Number,
        reflect: true,
      },
      wordCount: {
        type: Number,
        reflect: true,
        attribute: "word-count",
      },
      templateString: {
        type: String,
        reflect: true,
        attribute: "template",
      },
      _lang: {
        type: String,
        reflect: true,
        attribute: "lang",
      },
      for: {
        type: String,
        reflect: true,
      },
      readtime: {
        type: Number,
        reflect: true
      },
    };
  }

  // get readtime() {
  //   return Math.floor(this.wordCount / this.wpm) || 0;
  // }

  get readString() {
    if (this.readtime <= 0) {
      this.setAttribute("hidden", "");
      return;
    }

    this.removeAttribute("hidden");

    if (this.templateString && this.templateString.match(/%t/)) {
      return this.templateString.replace(/%t/, this.readtime);
    } else {
      return `${this.readtime}${this.templateString}`;
    }
  }

  render() {
    return html`
      <span class="pfe-readtime__text">${this.readString}</span>
    `;
  }

  updated(changed: PropertyValues) {
    if (changed.has("for")) {
      this._forChangeHandler();
    }

    if (changed.has("_lang")) {
      this._langChangedHandler();
    }

    if (changed.has("wordCount") || changed.has("wpm")) {
      this.readtime = Math.floor(this.wordCount / this.wpm) || 0;
    }
  }

  _forChangeHandler() {
    const target = document.querySelector(this.for) || document.querySelector(`#${this.for}`);
    
    if (target) {
      this.content = target;

      if (target.hasAttribute("word-count")) {
        const wcAttr = target.getAttribute("word-count");
        if (Number(wcAttr) >= 0) {
          this.wordCount = Number(wcAttr);
        }
      } else if (target.textContent.trim()) {
        this.wordCount = target.textContent.split(/\b\w+\b/).length;
      }

      // If a new target element is identified, re-render
      // NOTE: no longer needed because of LitElement
      // this.render();
    }
  }

  _langChangedHandler() {
    this.wpm = getEstimatedWPM(this._lang);
  }
}

PFElement.create(PfeReadtime);