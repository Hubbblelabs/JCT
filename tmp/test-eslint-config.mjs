import nextConfig from "eslint-config-next";
import coreWebVitalsConfig from "eslint-config-next/core-web-vitals";
import prettierConfig from "eslint-config-prettier/flat";

console.log("Next Config is Array:", Array.isArray(nextConfig));
console.log("Core Web Vitals is Array:", Array.isArray(coreWebVitalsConfig));
console.log("Prettier Config is Object:", typeof prettierConfig === 'object');
