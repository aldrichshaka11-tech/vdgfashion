/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    unoptimized: true,
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'vdgfashion.in',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'vdgfashion.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.vdgfashion.in',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
