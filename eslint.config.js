import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

// Node.js core modules that should not be imported in client code
const NODE_CORE_MODULES = [
  "fs", "path", "os", "child_process", "cluster", "crypto", "dgram", "dns",
  "http", "https", "net", "readline", "stream", "tls", "tty", "url", "util",
  "v8", "vm", "worker_threads", "zlib", "process", "buffer", "events",
  "querystring", "string_decoder", "timers", "assert", "async_hooks",
  "console", "constants", "domain", "inspector", "module", "perf_hooks",
  "punycode", "repl", "trace_events", "wasi"
];

export default tseslint.config(
  { ignores: ["dist", "supabase/functions/**"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      // Prevent CommonJS require() in client code
      "@typescript-eslint/no-require-imports": "error",
      // Prevent Node.js core module imports in client code
      "no-restricted-imports": ["error", {
        paths: NODE_CORE_MODULES.map(mod => ({
          name: mod,
          message: `Node.js module "${mod}" cannot be used in browser code. Move this logic to an edge function.`
        })),
        patterns: NODE_CORE_MODULES.map(mod => ({
          group: [`node:${mod}`, `node:${mod}/*`],
          message: `Node.js module "${mod}" cannot be used in browser code. Move this logic to an edge function.`
        }))
      }],
    },
  },
);
