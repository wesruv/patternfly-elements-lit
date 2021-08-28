# Converting PFE 1.x Component to Lit PFElement

## Properties (aka `static get properties`)

### `attr => attribute`
`attr` in PFElement 1.x was the preferred attribute name, in Lit, the property `attribute` can be the preferred name, or `false` if no attribute is desired.

[See Lit Docs for more](https://lit-element.polymer-project.org/guide/properties#property-options)

### `default => Set value in constructor`

In the top of the constructor (after `super()`), set a default value for any properties, e.g.

```js
  static get properties() {
    return {
      _lang: {
        type: String,
        attribute: "lang",
      },
    }
  };

  constructor() {
    super();
    // Set default value for attributes
    this._lang = 'en';
  }
```
