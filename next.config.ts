import type { NextConfig } from "next";
import path from "node:path";

// Built as a fully static site. On GitHub Pages it is served under
// /cinq-website, which the workflow passes in as NEXT_PUBLIC_BASE_PATH; run
// locally the prefix is empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
