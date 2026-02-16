/**
 * @type {import("next").NextConfig}
 **/
const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  serverExternalPackages: ["pino"],
  async redirects() {
    return [
      {
        source: '/datenpflege',
        destination: '/datenpflege/metadaten',
        permanent: false,
      },
    ];
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
