import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, 

  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [new URL('https://lwmxqyglgioiqmsulwet.supabase.co/storage/v1/object/public/promoimages/**')],
  },
  
};

export default nextConfig;
