import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async redirects() {
    return [
      {
        source: "/dashboard/referrals",
        destination: "/dashboard",
        permanent: false,
      },
      {
        source: "/dashboard/referrals/:path*",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
