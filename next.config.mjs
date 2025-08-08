/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: { bodySizeLimit: '15mb' },
    // keep heavy parsers out of the server bundle during build
    serverComponentsExternalPackages: ['pdf-parse', 'mammoth']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // also mark these as externals at build time
      config.externals = [...(config.externals || []), 'pdf-parse', 'mammoth'];
    }
    return config;
  }
};
export default nextConfig;
