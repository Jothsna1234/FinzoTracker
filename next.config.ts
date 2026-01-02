// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   images:{
//     remotePatterns:[
//       {
//         protocol:"https",
//         hostname:"randomuser.me",
//       },
//     ],
//   },
// };

// export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
  experimental: {
    turbopack: true,       // keep using Turbopack
    disableSourceMaps: true,
    serverActions:{
      bodySizeLimit:"5mb",
    } // <--- prevents the Invalid source map error
  },
};

export default nextConfig;
