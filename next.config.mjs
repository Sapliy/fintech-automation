const nextConfig = {
    output: 'export',
    eslint: {
        ignoreDuringBuilds: true,
    },
    reactStrictMode: true,
    transpilePackages: ['@xyflow/react'],
};

export default nextConfig;
