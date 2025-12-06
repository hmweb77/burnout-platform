/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
          'images.unsplash.com',
          'cdn.sanity.io', // Sanity CDN for images
        ],
      },
}

module.exports = nextConfig
