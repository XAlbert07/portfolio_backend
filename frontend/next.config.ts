import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseOrigin = supabaseUrl ? new URL(supabaseUrl) : null;

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  images: {
    remotePatterns: supabaseOrigin ? [{ protocol: supabaseOrigin.protocol.replace(":", "") as "http" | "https", hostname: supabaseOrigin.hostname, pathname: "/storage/v1/object/public/**" }] : [],
  },
};

export default nextConfig;
