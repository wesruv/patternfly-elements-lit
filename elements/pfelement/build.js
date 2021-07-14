import build from "../../scripts/build.js";

build({
  entryPoints: ["src/pfelement.ts"],
  // outfile: "dist/pfelement.js",
  outdir: "dist",
});

// import { build } from "esbuild";
// import sass from "sass";
// import { replace } from "@pwrs/esbuild-plugin-replace";

// const result = sass.renderSync({ file: "./src/pfelement.scss" });

// build({
//   entryPoints: ["src/pfelement.ts"],
//   outfile: "dist/pfelement.js",
//   watch: true,
//   plugins: [
//     replace({
//       "__css__": result.css.toString()
//     })
//   ]
// })
//   .then(result => result.stop)
//   .catch(e => console.error(e));