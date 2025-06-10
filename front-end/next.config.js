'use strict'

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: true,
        locale: false,
      },
    ];
  },
  
  // TODO: below line is added to resolve twice event dispatch in the calendar reducer
  reactStrictMode: false,

  // Adding webpack configuration from first file
  webpack: (config) => {
    config.module.rules.push({
      test: /\.node/,
      use: "raw-loader",
    });
    return config;
  },
};

module.exports = nextConfig;
