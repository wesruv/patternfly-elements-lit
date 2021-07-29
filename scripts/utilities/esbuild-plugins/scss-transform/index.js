import sass from "sass";
import { dirname, resolve } from "path";

function pathResolve({ resolveDir, path, importer }) {
  return resolve(resolveDir || dirname(importer), path);
}

const scssTransform = {
  name: "scsstransform",
  setup(build) {
    build.onResolve({ filter: /\.scss$/ }, (args) => {
      return {
        path: pathResolve(args),
        namespace: "scsstransform",
        pluginData: args
      };
    });

    build.onLoad({ filter: /./, namespace: "scsstransform" }, (args) => {
      const compiled = sass.renderSync({ file: args.path });
      return {
        contents: `
          import { css } from "@patternfly/pfelement";
export default css\`
${compiled.css.toString()}\``,
        loader: "js",
        resolveDir: dirname(args.pluginData.resolveDir)
      };
    });
  },
};

export default scssTransform;