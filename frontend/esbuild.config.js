const esbuild = require("esbuild");
const sassPlugin = require("esbuild-plugin-sass");
const copyPlugin = require("esbuild-plugin-copy");

esbuild
  .build({
    entryPoints: ["./src/scripts/main.ts"],
    bundle: true,
    outfile: "../build/sequencer-talk-raffle-tool/static/bundle.js",
    sourcemap: false,
    //watch: true,
    minify: false, // Minify the output
    target: 'es2015', // Specify the target ECMAScript version
    loader: {
      '.png': 'file', // Use the file loader for PNG files
      '.jpg': 'file',
      '.gif': 'file',
      '.woff': 'file',
      '.woff2': 'file',
      '.eot': 'file',
      '.ttf': 'file',
      '.svg': 'file',
    },
    plugins: [
      sassPlugin({
        //output: "../static/main.css",
      }),
      copyPlugin.copy({
        resolveFrom: "cwd",
        assets: {
          from: ["../templates/index.html"],
          to: ["../build/sequencer-talk-raffle-tool/"],
        },
       // watch: true,
      }),
      /*copyPlugin.copy({ // für test_root
        resolveFrom: "cwd",
        assets: {
          from: ["./src/assets/img/*"],
          to: ["./server/test_root/img/"],
        },
       // watch: true,
      }),
      copyPlugin.copy({
        resolveFrom: "cwd",
        assets: {
          from: ["./src/addons/**"],
          to: ["./server/html/redaxo/src/addons/"]
        }
      }),*/
    ],
  })
  .then(() => {})
  .catch(() => process.exit(1));

