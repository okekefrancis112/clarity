
/// <reference types="vitest" />

// import { defineConfig } from "vite";
import { defineConfig } from 'vitest/config';
import { vitestSetupFilePath, getClarinetVitestsArgv } from "@hirosystems/clarinet-sdk/vitest";

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

export default defineConfig({
  test: {
    environment: "clarinet", // use vitest-environment-clarinet
    globals: true,
    include: ['tests/**/*.{test,spec}.ts'],
    // include: ['tests/**/*.{test,spec}.ts'], // Include .test.ts files
    pool: "forks",
    poolOptions: {
      threads: { singleThread: true },
      forks: { singleFork: true },
    },
    setupFiles: [
      vitestSetupFilePath,
      // custom setup files can be added here
    ],
    environmentOptions: {
      clarinet: {
        ...getClarinetVitestsArgv(),
        // add or override options
        manifest: './Clarinet.toml', // Explicitly specify the manifest
        debug: true // Enable debug logs for Clarinet environment
      },
    },
    outputFile: 'test-output.json' // Log test output for debugging
  },
});

