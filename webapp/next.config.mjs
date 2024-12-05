/**
 * @type {import("next").NextConfig}
 **/
const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  experimental: {
    serverComponentsExternalPackages: ["pino"],
  },
};

export default nextConfig;
