
// /// <reference types="vitest" />

// // import { defineConfig } from "vite";
// import { defineConfig } from 'vitest/config';
// import { vitestSetupFilePath, getClarinetVitestsArgv } from "@hirosystems/clarinet-sdk/vitest";
// import path from "node:path";

/*
  In this file, Vitest is configured so that it works seamlessly with Clarinet and the Simnet.

  The `vitest-environment-clarinet` will initialise the clarinet-sdk
  and make the `simnet` object available globally in the test files.

  `vitestSetupFilePath` points to a file in the `@hirosystems/clarinet-sdk` package that does two things:
    - run `before` hooks to initialize the simnet and `after` hooks to collect costs and coverage reports.
    - load custom vitest matchers to work with Clarity values (such as `expect(...).toBeUint()`)

  The `getClarinetVitestsArgv()` will parse options passed to the command `vitest run --`
    - vitest run -- --manifest ./Clarinet.toml  # pass a custom path
    - vitest run -- --coverage --costs          # collect coverage and cost reports
*/

// export default defineConfig({
//   test: {
//     environment: "clarinet",
//     include: ['tests/**/*.{test,spec}.ts'], // Include .test.ts files
//     globals: true,
//     pool: "forks",
//     poolOptions: {
//       threads: { singleThread: true },
//       forks: { singleFork: true },
//     },
//     setupFiles: [
//       vitestSetupFilePath,
//       // custom setup files can be added here
//     ],
//     environmentOptions: {
//       clarinet: {
//         ...getClarinetVitestsArgv(),
//         // add or override options
//         // manifest: './Clarinet.toml', // Explicitly specify the manifest
//         // manifestPath: path.resolve(__dirname, "settings", "Devnet.toml"),
//         manifestPath: path.resolve(__dirname, "Clarinet.toml"), // ✅ use root manifest
//         coverage: false,
//         costs: false,
//         debug: true // Enable debug logs for Clarinet environment
//       },
//     },
//     // deps: {
//     //   inline: ["vitest-environment-clarinet"], // force Vitest to process it
//     // },
//     // If you’re running Vitest normally
//     deps: {
//       optimizer: {
//         ssr: {
//           include: ["some-package"],
//         },
//       },
//     },
//     outputFile: 'test-output.json' // Log test output for debugging
//   },
// });


/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';
import { vitestSetupFilePath, getClarinetVitestsArgv } from "@hirosystems/clarinet-sdk/vitest";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    environment: "clarinet",
    include: ['tests/**/*.{test,spec}.ts'],
    globals: true,
    pool: "forks",
    poolOptions: {
      threads: { singleThread: true },
      forks: { singleFork: true },
    },
    setupFiles: [vitestSetupFilePath],
    environmentOptions: {
      clarinet: {
        ...getClarinetVitestsArgv(),
        manifestPath: path.resolve(__dirname, "Clarinet.toml"),
        coverage: false,
        costs: false,
        debug: true
      },
    },
    // deps: {
    //   optimizer: {
    //     ssr: {
    //       include: ["vitest-environment-clarinet"],
    //     },
    //   },
    // },
    outputFile: 'test-output.json'
  },
});
