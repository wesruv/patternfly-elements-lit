import { build } from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";

export default function (config = {}) {
  console.log("building", config)
  
  return build({
    ...config,

    format: "esm",
    allowOverwrite: true,
    bundle: true,
    external: ["\.\."],
    splitting: true,
    treeShaking: true,
    legalComments: "linked",

    // target: "es2020",
    // logLevel: "info",
    // metafile: true,
    // metafileName: "module-tree.json",
    // minify: true,
    // sourcemap: true,

    watch: true,
    plugins: [
      sassPlugin({
        type: "lit-css"
      })
    ]
  })
    .then(result => result.stop)
    .catch(e => console.error(e));
}