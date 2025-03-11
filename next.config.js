/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.txt$/,
      use: [
        {
          loader: 'raw-loader',
          options: {
            esModule: false,
          },
        },
      ],
    });
    return config;
  },
  // Add this to handle ESM packages
  transpilePackages: ['react-simple-maps', 'd3-scale', 'react-tooltip'],
}

module.exports = nextConfig 