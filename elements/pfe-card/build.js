import build from "../../scripts/build.js";

build({
  entryPoints: ["src/pfe-card.ts"],
  outdir: "dist",
});

// import { build } from "esbuild";
// import sass from "sass";
// import { replace } from "@pwrs/esbuild-plugin-replace";

// const result = sass.renderSync({ file: "./src/pfe-card.scss" });

// build({
//   entryPoints: ["src/pfe-card.ts"],
//   outfile: "dist/pfe-card.js",
//   watch: true,
//   plugins: [
//     replace({
//       "__css__": result.css.toString()
//     })
//   ]
// })
//   .then(result => result.stop)
//   .catch(e => console.error(e));