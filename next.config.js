/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // 解決 @selfxyz/qrcode 和相關依賴的問題
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

const removeImports = require('next-remove-imports')();
module.exports = removeImports(nextConfig);
