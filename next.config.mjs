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
    domains: ["images.unsplash.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
