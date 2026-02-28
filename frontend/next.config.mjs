/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  async rewrites() {
    const backendUrl =
      process.env.NODE_ENV === "production"
        ? "http://backend:5000"
        : process.env.BACKEND_URL ?? "http://localhost:5000";

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`
      }
    ];
  }
};

export default nextConfig;
