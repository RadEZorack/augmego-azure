/** @type {import('next').NextConfig} */

export default {
    reactStrictMode: true,
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Modify the config as needed
        return config;
    },
  };