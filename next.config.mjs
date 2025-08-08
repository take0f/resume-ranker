/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: { bodySizeLimit: '15mb' },
    serverComponentsExternalPackages: ['pdf-parse', 'mammoth']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'pdf-parse', 'mammoth'];
    }
    return config;
  }
};

export default nextConfig;
