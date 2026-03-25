/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/admin/product/:path*",
        destination: "/admin/products/:path*",
        permanent: true,
      },
      {
        source: "/admin/inventory",
        destination: "/admin/products",
        permanent: true,
      },
    ];
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
