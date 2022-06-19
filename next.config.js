const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/warehouses',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
