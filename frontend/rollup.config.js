import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/scripts/main.ts', // Entry point of your TypeScript code
  output: {
    file: 'build/sequencer-talk-raffle-tool/static/bundle.js', // Output file path
    format: 'iife', // Output format (IIFE for browser)
    name: 'MyApp', // Global variable name (optional)
  },
  plugins: [
    resolve(), // Resolve bare module specifiers
    commonjs(), // Convert CommonJS modules to ES6
    typescript(), // Compile TypeScript files
  ],
};
