import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Permite build com erros de tipo (apenas em produção)
    ignoreBuildErrors: false,
  },
  eslint: {
    // Permite build com warnings ESLint (apenas em produção)
    ignoreDuringBuilds: false,
  },
  experimental: {
    // Remove configurações experimentais problemáticas
  },
};

export default nextConfig;
