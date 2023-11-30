const path = require("path");

module.exports = {
  devtool: "cheap-module-source-map", // Add this line to your existing webpack config  entry: './src/index.ts', // Your entry TypeScript file
  optimization: {
    minimize: false,
    minimizer: [],
  },
  output: {
    filename: "AdvancedOperator.js",
    path: path.resolve(__dirname, "dist/AdvancedOperator"),
    clean: true,
    environment: {
      // The environment supports arrow functions ('() => { ... }').
      arrowFunction: false,
      // The environment supports BigInt as literal (123n).
      bigIntLiteral: false,
      // The environment supports const and let for variable declarations.
      const: false,
      // The environment supports destructuring ('{ a, b } = obj').
      destructuring: false,
      // The environment supports an async import() function to import EcmaScript modules.
      dynamicImport: false,
      // The environment supports 'for of' iteration ('for (const x of array) { ... }').
      forOf: false,
      // The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').
      module: false,
      // The environment supports optional chaining ('obj?.a' or 'obj?.()').
      optionalChaining: false,
      // The environment supports template literals.
      templateLiteral: false
    }
  },
  resolve: {
    extensions: [".ts", ".js"] // File extensions to resolve
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader", // Use ts-loader for TypeScript files
        exclude: /node_modules/
      }
    ]
  }
};

/*
module.exports = {
  entry: "./compiled/index.js",

  mode: "development",
  optimization: {
    minimize: false,
    minimizer: [],
  },
  output: {
    filename: "AdvancedOperator.js",
    path: path.resolve(__dirname, "dist/AdvancedOperator"),
    clean: true,
    environment: {
      // The environment supports arrow functions ('() => { ... }').
      arrowFunction: false,
      // The environment supports BigInt as literal (123n).
      bigIntLiteral: false,
      // The environment supports const and let for variable declarations.
      const: false,
      // The environment supports destructuring ('{ a, b } = obj').
      destructuring: false,
      // The environment supports an async import() function to import EcmaScript modules.
      dynamicImport: false,
      // The environment supports 'for of' iteration ('for (const x of array) { ... }').
      forOf: false,
      // The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').
      module: false,
      // The environment supports optional chaining ('obj?.a' or 'obj?.()').
      optionalChaining: false,
      // The environment supports template literals.
      templateLiteral: false,
    },
  },
};*/