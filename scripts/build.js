import esbuild from "esbuild";
import scssTransform from "./utilities/esbuild-plugins/scss-transform/index.js";

esbuild.build({
  entryPoints: [
    "elements/pfe-cta/src/pfe-cta.ts",
    "elements/pfe-card/src/pfe-card.ts",
    "elements/pfe-badge/src/pfe-badge.ts",
    "elements/pfe-button/src/pfe-button.ts",
  ],
  entryNames: "[dir]/../dist/[name]",
  outdir: "elements",
  // outbase: "src",
  format: "esm",
  allowOverwrite: true,
  bundle: true,
  external: ["@patternfly*", "lit*",],
  // splitting: true,
  treeShaking: true,
  legalComments: "linked",
  watch: Boolean(process.env.WATCH) || false,

  // target: "es2020",
  logLevel: "info",
  // metafile: true,
  // metafileName: "module-tree.json",
  // minify: true,
  sourcemap: true,
  plugins: [
    scssTransform()
  ]
}).then(result => result.stop)
  .catch(error => console.error(error));

// Build PFElement
esbuild.build({
  entryPoints: [
    "elements/pfelement/src/pfelement.ts",
  ],
  outdir: "elements/pfelement/dist",
  format: "esm",
  watch: Boolean(process.env.WATCH) || false,
  bundle: true,
  minify: true,
  minifyWhitespace: true
}).then(result => result.stop)
.catch(error => console.error(error));

// Build some Sass
esbuild.build({
  entryPoints: [
    "elements/pfelement/src/pfelement.scss",
  ],
  outdir: "elements/pfelement/dist",
  watch: Boolean(process.env.WATCH) || false,
  minify: true,
  minifyWhitespace: true,
  plugins: [
    scssTransform({
      type: "css"
    })
  ]
}).then(result => result.stop)
.catch(error => console.error(error));