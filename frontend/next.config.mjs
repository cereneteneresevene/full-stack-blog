/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: "/api/:path*", // Frontend'de kullanılacak endpoint
          destination: "http://localhost:5000/api/:path*", // Backend API'sinin URL'si
        },
      ];
    },
  };
  
  export default nextConfig;
  