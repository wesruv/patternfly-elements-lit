import { build } from "esbuild";
import sass from "sass";
import { replace } from "@pwrs/esbuild-plugin-replace";

const result = sass.renderSync({ file: "./src/pfe-badge.scss" });

build({
  entryPoints: ["src/pfe-badge.ts"],
  outfile: "dist/pfe-badge.js",
  watch: true,
  plugins: [
    replace({
      "__css__": result.css.toString()
    })
  ]
})
  .then(result => result.stop)
  .catch(e => console.error(e));