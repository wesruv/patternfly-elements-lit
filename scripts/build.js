import esbuild from "esbuild";
import {sassPlugin} from "esbuild-sass-plugin";

const pluginCache = new Map();

esbuild.build({
    entryPoints: [
        "elements/pfe-card/src/pfe-card.ts",
        "elements/pfe-badge/src/pfe-badge.ts",
        "elements/pfelement/src/pfelement.ts",
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

    // target: "es2020",
    // logLevel: "verbose",
    // metafile: true,
    // metafileName: "module-tree.json",
    // minify: true,
    sourcemap: true,

    // watch: true,
    plugins: [
        sassPlugin({
            type: "lit-css",
            cache: pluginCache,
        })
    ]
});
