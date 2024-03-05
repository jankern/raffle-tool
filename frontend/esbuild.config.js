const esbuild = require("esbuild");
const sassPlugin = require("esbuild-plugin-sass");
const copyPlugin = require("esbuild-plugin-copy");

esbuild
  .build({
    entryPoints: ["./src/scripts/main.ts"],
    bundle: true,
    outfile: "../static/bundle.js",
    //watch: true,
    plugins: [
      sassPlugin({
        output: "../static/main.css",
      }),
      copyPlugin.copy({
        resolveFrom: "cwd",
        assets: {
          from: ["./src/index.html"],
          to: ["../static/index.html"],
        },
       // watch: true,
      }),
    ],
  })
  .then(() => {})
  .catch(() => process.exit(1));

