/**
 * @type {import("next").NextConfig}
 **/
const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  serverExternalPackages: ["pino"],
  // Sass-Deprecation-Handling:
  // - `quietDeps` unterdrückt alle Deprecations aus node_modules (v.a.
  //   Bootstrap 5.3, das intern noch @import/red()/mix() nutzt — wir haben
  //   darauf keinen Einfluss bis Bootstrap 6).
  // - `silenceDeprecations: ["import"]` erlaubt die bewusst erhaltenen
  //   @import-Statements in main.scss und den Component-Partials, ohne
  //   dass jeder Build-Log damit vollläuft. Umstellung auf @use ist ein
  //   eigenes, größeres Ticket (Bootstrap-Interop erforderlich).
  sassOptions: {
    quietDeps: true,
    silenceDeprecations: ["import"],
  },
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
