# PatternFly Elements - Lit Element Exploration

This repository is an investigation into the effort needed to use [LitElement](https://lit.dev) as the base class for PatternFly Elements. 

## Goals
1. Have `PFElement` extend `LitElement`.
2. Improve the speed of the developer experience using [@web/dev-server](https://github.com/modernweb-dev/web/tree/master/packages/dev-server) and [esbuild](https://esbuild.github.io/).
3. Improve the IDE experience and integrity of PatternFly Elements by using TypeScript.
4. Explore NOT delivering distributable files which follows the recommendation by the [open-wc project](https://open-wc.org/docs/building/overview/).

## Getting started
Be sure to `npm install` the dependencies and dev dependencies.

### Start the dev server
```
npm start
```

### Start watching for changes to files and build
```
npm run dev
```

### Start the test server and watch for changes
```
npm run test:watch
```

### Build the project
```
npm run build
```

## Differences from v1.0 of PatternFly Elements
### The PFElement base class extends LitElement
Extending LitElement provides multiple benefits
- Additional lifecycle callbacks: hasChanged, requestUpdate, willUpdate, update, etc.
- More efficient template rendering. lit-html only rebuilds sections of templates that have changed unlike PFElement that rerenders the entire template and needs to be called manually.
- Community support
- PFElement will continue to provide theming and context functionality as well as the logging and debugging features.

### Imports from PFElement and exports in PFElement
Each component will extend PFElement and will need to import, `PFElement`, `html` and `css` from PFElement.
```
import { PFElement, html, css } from "@patternfly/pfelement"
```

What makes this possible is that PFElement will be exporting `html` and `css` from `lit`. The reason for this is to bundle these two features into the PFElement base class since all PatternFly Elements components will be using these two imports.

### Component file structure
For each component in PatternFly Elements v1.0 we had an HTML, Scss, and a JavaScript file. For v2.0, we will no longer use a separate HTML file. The HTML will now be written in a TypeScript file. The new file structure looks like:
- pfe-component
  - pfe-component.ts
  - pfe-component.scss

### Development tools
#### TypeScript
TypeScript is great for large projects and it should give the project multiple benefits.
- Catch compile time issues ahead of possible run time issues
- Access to the latest JavaScript features
- Easy and fast to compile with esbuild
- Code completion in the IDE

### No longer shipping polyfills
Shipping polyfills with components is a bad practice (polyfill collision, they're not needed in all browsers) and we're going to discontinue shipping polyfills with this release. By cutting out the polyfills we will
- Trim file size
- Avoid stomping on an already loaded polyfill
- Avoid having our polyfills stomped on

For any polyfills that might be required, we'll indicate it in our documentation.

#### esbuild
[esbuild](https://esbuild.github.io/) is an incredibly fast build tool that will replace the build tooling in v1.0 that included Gulp, Rollup, Babel, Uglify, and CommonJS. esbuild allows us to compile our TypeScript files and the esbuild Sass Plugin takes our Scss and injects into the built file. As a result, build times will be much quicker and the project will have fewer development dependencies.

#### @web/dev-server
[dev-server](https://modern-web.dev/docs/dev-server/overview/) will replace Browsersync. Reasons for dev-server include
- Resolves bare module imports in the browser
- Supports plugins for esbuild
- Live reloading (Browsersync also supports this)
- Recommended by [lit](https://lit.dev/) and [open-wc](https://open-wc.org/)

## What's staying the same
### Testing
We've begun the transition to [@open-wc/testing](https://open-wc.org/docs/testing/testing-package/) with [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/) and [Playwright](https://modern-web.dev/docs/test-runner/browser-launchers/playwright/).

### Documentation
We'll continue to use [11ty](https://11ty.dev) for our documentation site. The question is around whether or not the documentation site code should continue to live in this repository.

### Storybook?
Maybe. The demo and documentation pages have been providing more value than our Storybook pages. I'm not sure if it's worth the effort of maintaining another dev dependency and tooling for something that isn't used often.

## What's possible?
### custom-elements-manifest
The [custom-elements-manifest](https://github.com/webcomponents/custom-elements-manifest) is a proposal for how to describe custom elements. This file can help with
- Editor support
- Documentation and demos
- Linting
- Framework integration
- Cataloging
- Testing