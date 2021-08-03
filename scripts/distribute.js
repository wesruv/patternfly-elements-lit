/*
 * Goals
 * 1. Correctly modify any imports
 * 2. Provide an unminifed and a minified version (still need TODO)
 * 
 * Questions
 * 1. Do we start with the files in src or do we pull from
 *    the dist directory?
 */

import esbuild from "esbuild";
import rewritePaths from "./utilities/esbuild-plugins/rewrite-paths/index.js";

esbuild.build({
  entryPoints: [
    "elements/pfe-badge/dist/pfe-badge.js",
    "elements/pfe-button/dist/pfe-button.js",
    "elements/pfe-card/dist/pfe-card.js",
    "elements/pfe-cta/dist/pfe-cta.js",
    "elements/pfe-datetime/dist/pfe-datetime.js",
    "elements/pfelement/dist/pfelement.js",
  ],
  entryNames: "[dir]/../built/[name]",
  outdir: "elements",
  minify: true,
  minifyWhitespace: true,
  allowOverwrite: true,
  plugins: [ rewritePaths ]
});