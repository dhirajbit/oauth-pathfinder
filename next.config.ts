import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The generate page reads searchParams and the API streams; keep classic dynamic rendering.
  cacheComponents: false,
  agentRules: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
