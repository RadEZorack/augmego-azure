/** @type {import('next').NextConfig} */
import { execSync } from 'child_process';

const isProd = process.env.NODE_ENV === 'production';
const assetPrefix = isProd ? '/static' : '';

export default {
    output: 'export',
    reactStrictMode: true,
    assetPrefix,
    publicRuntimeConfig: {
        assetPrefix,
    },
    webpack: (config, { isServer }) => {
        if (!isServer && isProd) {
        config.output.publicPath = '/static/_next/';
        }
        return config;
    },
    // Export configurations
    exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
        return {
        '/': { page: '/' },
        // Add other pages if you have them
        };
    },
    trailingSlash: true,
  };