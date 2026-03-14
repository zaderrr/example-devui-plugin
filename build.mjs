import { build } from "esbuild";

// Shim react imports to use the host app's React exposed on window.__DEVUI_REACT__
const reactShimPlugin = {
  name: "react-shim",
  setup(build) {
    // Intercept bare "react" and "react/jsx-runtime" imports
    build.onResolve({ filter: /^react(\/.*)?$/ }, (args) => ({
      path: args.path,
      namespace: "react-shim",
    }));
    build.onLoad({ filter: /.*/, namespace: "react-shim" }, (args) => {
      if (args.path === "react/jsx-runtime" || args.path === "react/jsx-dev-runtime") {
        return {
          contents: `
            const React = window.__DEVUI_REACT__;
            export const jsx = React.createElement;
            export const jsxs = React.createElement;
            export const jsxDEV = React.createElement;
            export const Fragment = React.Fragment;
          `,
          loader: "js",
        };
      }
      // Plain "react" import
      return {
        contents: `export default window.__DEVUI_REACT__; export const { useState, useEffect, useCallback, useRef, useMemo, useContext, useReducer, Fragment, createElement, createContext } = window.__DEVUI_REACT__;`,
        loader: "js",
      };
    });
  },
};

await build({
  entryPoints: ["src/index.tsx"],
  bundle: true,
  format: "esm",
  outfile: "dist/index.js",
  plugins: [reactShimPlugin],
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
});

console.log("Built dist/index.js");
