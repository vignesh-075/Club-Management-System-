/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure file extensions
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Remove TypeScript-specific configuration
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
