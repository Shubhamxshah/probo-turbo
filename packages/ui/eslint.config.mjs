import { nextJsConfig } from "@repo/eslint-config/next";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/** @type {import("eslint").Linter.Config} */
export default nextJsConfig;
