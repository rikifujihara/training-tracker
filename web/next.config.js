/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@prisma/client')
    }
    
    // Optimize webpack cache for large strings
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization?.splitChunks,
        cacheGroups: {
          ...config.optimization?.splitChunks?.cacheGroups,
          prisma: {
            test: /[\\/]node_modules[\\/](@prisma|prisma)[\\/]/,
            name: 'prisma',
            chunks: 'all',
            priority: 10,
          },
        },
      },
    }
    
    return config
  }
}

export default nextConfig