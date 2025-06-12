const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: "./src/main.tsx",
  devtool: false,
  module: {
    rules: [
      //* ------- TypeScript Loader ------- */
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: "tsconfig.json",
          },
        },
        exclude: /node_modules/,
      },

      //* ------- Babel Loader ------- */
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            targets: "defaults",
            presets: ["@babel/preset-env"],
          },
        },
      },

      //* ------- File CSS Loader ------- */
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },

      // * ------- Image Loader ------- */
      {
        test: /\.html$/i,
        loader: "html-loader",
      },

      //* ------- Image Asset Loader ------- */
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
      },
    ],
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
  },

  //* ------- Plugins ------- */
  plugins: [
    new Dotenv(),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index.html"),
      publicPath: "/",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
    }),

    new CopyPlugin({
      patterns: [
        { from: "public/assets", to: "assets" },
        { from: "src/assets", to: "assets" },
        { from: "public/_redirects", to: "_redirects" },
      ],
    }),
  ],
};
