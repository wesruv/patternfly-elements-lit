import { readdirSync } from "fs";
import { resolve } from "path";
import esbuild from "esbuild";
import scssTransform from "./utilities/esbuild-plugins/scss-transform/index.js";

// exclude pfelement and pfe-sass because there are two different build
// steps: one for pfe-sass and one for pfelement
const entryPointFilesExcludes = [
  "pfe-sass",
  "pfelement",
];

// grab all of the directories in /elements excluding directories
// in entryPointFilesExcludes and generate an array that gets the
// TypeScript src file for each element
const entryPoints = readdirSync(resolve("elements"), { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && !entryPointFilesExcludes.includes(dirent.name))
  .map(dirent => `elements/${dirent.name}/src/${dirent.name}.ts`);

esbuild.build({
  entryPoints,
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