import esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";

const pluginCache = new Map();

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
  external: ["@patternfly/pfelement", "lit*",],
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
    sassPlugin({
      type: "lit-css",
      cache: pluginCache,
    })
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
    sassPlugin()
  ]
}).then(result => result.stop)
.catch(error => console.error(error));
