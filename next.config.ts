import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.freepik.com",
        pathname: "/**", // Allow all images from this domain
      },
      {
        protocol: "https",
        hostname: "pub-b2cd6b49f6f042109b750b07ab45d1ff.r2.dev",
        pathname: "/**", // Allow all images from this domain
      },
      {
        protocol: "https",
        hostname: "mdxblog.io",
        pathname: "/**", // Allow all images from this domain
      },
    ]
  }
}

export default nextConfig;
