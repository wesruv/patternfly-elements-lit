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