const path = require("path");
const config = require("./webpack.config");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { merge } = require("webpack-merge");
const { GenerateSW } = require("workbox-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const fs = require("fs");

// Cek keberadaan icon file
const iconPath = path.resolve("public/assets/icon.png");
const iconExists = fs.existsSync(iconPath);

module.exports = merge(config, {
  mode: "production",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    assetModuleFilename: "img/[hash][ext]",
    clean: true,
    publicPath: "/",
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "main.[contenthash].css",
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public",
          to: "",
          noErrorOnMissing: true,
        },
      ],
    }),

    // PWA Manifest - hanya jika icon ada
    ...(iconExists
      ? [
          new WebpackPwaManifest({
            name: "ArtiSign - Digital Signature App",
            short_name: "ArtiSign",
            description: "Professional Digital Signature Application",
            background_color: "#ffffff",
            theme_color: "#1f2937",
            start_url: "/",
            display: "standalone",
            orientation: "portrait-primary",
            scope: "/",
            crossorigin: "use-credentials",
            ios: {
              "apple-mobile-web-app-title": "ArtiSign",
              "apple-mobile-web-app-status-bar-style": "default",
            },
            icons: [
              {
                src: iconPath,
                sizes: [72, 96, 128, 144, 152, 192, 384, 512],
                destination: "icons",
                ios: true,
              },
            ],
          }),
        ]
      : []),

    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      navigateFallback: "/index.html",
      navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com/,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "google-fonts-stylesheets",
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com/,
          handler: "CacheFirst",
          options: {
            cacheName: "google-fonts-webfonts",
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
          },
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "images",
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 30 * 24 * 60 * 60,
            },
          },
        },
        {
          urlPattern: /\.(?:js|css)$/,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "static-resources",
          },
        },
      ],
    }),
  ],

  optimization: {
    minimizer: [new CssMinimizerPlugin(), "..."],
    splitChunks: {
      chunks: "all",
    },
  },
});
