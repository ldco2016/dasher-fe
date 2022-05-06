const withTM = require('next-transpile-modules')([
  '@mui/material',
  '@mui/system',
]) // pass the modules you would like to see transpiled

module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  env: {
    REACT_APP_CURRENT_COMMIT_SHA1: process.env.REACT_APP_CURRENT_COMMIT_SHA1,
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg?$/,
      oneOf: [
        {
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                prettier: false,
                svgo: true,
                svgoConfig: {
                  plugins: [{ removeViewBox: false }],
                },
                titleProp: true,
              },
            },
          ],
          issuer: {
            and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
          },
        },
      ],
    })

    config.resolve.alias = {
      ...config.resolve.alias,
      '@mui/styled-engine': '@mui/styled-engine-sc',
    }

    return config
  },
  rewrites: async () => {
    return [
      {
        source: '/legal/terms',
        destination: '/legal/terms.html',
      },
      {
        source: '/legal/privacy',
        destination: '/legal/privacy.html',
      },
    ]
  },
}
