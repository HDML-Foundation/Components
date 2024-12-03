import fs from "fs";
import path from "path";
import * as esbuild from "esbuild"
import findCacheDir from "find-cache-dir";
import * as watch from "node-watch";
import { argv } from "process";

function buildWorkerPlugin() {
  async function buildWorker(workerPath) {
    const cacheDir = findCacheDir({
      name: "esbuild-worker",
      create: true,
    });
    const bundle = path.resolve(cacheDir, "worker.js");
    await esbuild.build({
      entryPoints: [workerPath],
      outfile: bundle,
      bundle: true,
      minify: true,
      sourcemap: true,
      format: "iife",
    });
    return fs.promises.readFile(bundle, {encoding: "utf-8"});
  }

  return {
    name: "esbuild-worker",
    setup(build) {
      build.onLoad(
        {
          filter: /\.worker\.js$/,
        },
        async ({ path: workerPath }) => {
          let workerCode = await buildWorker(workerPath);
          return {
            contents:
              `const _script = ${JSON.stringify(workerCode)};` +
              `export default _script\n`,
            loader: "js",
          };
        }
      );
    },
  };
}

async function build() {
  await esbuild.build({
    entryPoints: ["./esm/index.js"],
    outfile: "./bin/index.min.js",
    bundle: true,
    minify: true,
    sourcemap: true,
    format: "iife",
    plugins: [buildWorkerPlugin()],
  });
}

await build();

if(argv[2] === "--watch") {
  watch.default(path.resolve("./esm"), { recursive: true }, build);
}
