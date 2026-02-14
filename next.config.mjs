const nextConfig = {
    // output: 'export',
    output: 'standalone',
    eslint: {
        ignoreDuringBuilds: true,
    },
    reactStrictMode: true,
    transpilePackages: ['@xyflow/react'],
};

export default nextConfig;
